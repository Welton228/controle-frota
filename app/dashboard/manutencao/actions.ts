"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { parseNFeXml } from "@/lib/xmlParser";

/**
 * Registra uma nova manutenção.
 * Utiliza transação para garantir que a manutenção e o anexo sejam salvos juntos.
 */
export async function registerMaintenance(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autenticado");

  // Captura e Sanitização dos dados
  const vehicleId = formData.get("vehicleId") as string;
  const tipo = formData.get("tipo") as string;
  const dataManutencao = new Date(formData.get("dataManutencao") as string);
  const dataPrevisao = new Date(formData.get("dataPrevisao") as string);
  const descricao = formData.get("descricao") as string;

  // Math.max(0, ...) garante que, mesmo se o usuário digitar um negativo ou falhar na conversão, o valor seja 0
  const kmNoMomento = Math.max(
    0,
    parseInt(formData.get("kmNoMomento") as string) || 0,
  );
  const valor = Math.max(0, parseFloat(formData.get("valor") as string) || 0);

  const file = formData.get("file") as File | null;

  try {
    // Transação: Se uma parte falhar, o banco não salva nada (proteção contra dados órfãos)
    await prisma.$transaction(async (tx) => {
      // 1. Cria a manutenção
      const maintenance = await tx.maintenance.create({
        data: {
          vehicleId,
          kmNoMomento,
          valor,
          tipo,
          dataManutencao,
          dataPrevisao,
          descricao,
          userId: session.user.id,
          concluido: false,
        },
      });

      // 2. Lógica de Anexo
      if (file && file.size > 0) {
        let fileType = "PDF";

        // Se for XML, processa os dados automaticamente
        if (file.name.endsWith(".xml")) {
          const text = await file.text();
          const parsedData = await parseNFeXml(text);
          fileType = "XML";

          // Atualiza a manutenção com os dados extraídos do XML
          await tx.maintenance.update({
            where: { id: maintenance.id },
            data: {
              valor: Math.max(0, parsedData.totalValue), // Segurança: força valor >= 0
              descricao: parsedData.description,
            },
          });
        }

        // Cria o registro do documento vinculado à manutenção
        await tx.document.create({
          data: {
            fileName: file.name,
            fileType: fileType,
            url: "pending-upload-path", // Futuro: substituir pela URL do Supabase Storage
            maintenanceId: maintenance.id,
          },
        });
      }
    });

    revalidatePath("/dashboard/manutencao");
  } catch (error) {
    console.error("Erro ao registrar manutenção:", error);
    throw new Error(
      "Não foi possível registrar a manutenção no banco de dados.",
    );
  }
}

/**
 * Atualiza uma manutenção existente.
 * Impede a edição de registros já marcados como concluídos (trava de segurança).
 */
export async function updateMaintenance(formData: FormData) {
  const id = formData.get("id") as string;
  const descricao = formData.get("descricao") as string;

  // Sanitização de segurança (garante que não sejam inseridos negativos)
  const valor = Math.max(0, parseFloat(formData.get("valor") as string) || 0);
  const kmNoMomento = Math.max(
    0,
    parseInt(formData.get("kmNoMomento") as string) || 0,
  );

  try {
    // Verifica se o registro existe e se já está concluído
    const m = await prisma.maintenance.findUnique({ where: { id } });
    if (!m) throw new Error("Registro não encontrado.");
    if (m.concluido)
      throw new Error("Registro bloqueado: esta manutenção já foi concluída.");

    // Executa o update
    await prisma.maintenance.update({
      where: { id },
      data: {
        valor,
        descricao,
        kmNoMomento,
      },
    });

    revalidatePath("/dashboard/manutencao/lista");
  } catch (error) {
    console.error("Erro ao atualizar manutenção:", error);
    throw new Error("Não foi possível atualizar o registro.");
  }
}
