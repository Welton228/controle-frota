"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Gestão de Funcionários ---

/**
 * Cria um novo colaborador.
 */
export async function createUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const zonaAtendimento = formData.get("zonaAtendimento") as string;

  try {
    await prisma.user.create({
      data: { name, email, phone, zonaAtendimento },
    });
    // Atualiza a listagem após a criação
    revalidatePath("/dashboard/gestao/funcionarios");
  } catch (error) {
    console.error("Erro ao criar funcionário:", error);
    throw new Error("Não foi possível cadastrar o colaborador.");
  }

  // O redirect é colocado FORA do bloco try/catch para garantir o funcionamento correto
  redirect("/dashboard/gestao/funcionarios");
}

/**
 * Atualiza os dados de um colaborador existente.
 */
export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;
  const phone = formData.get("phone") as string;
  const status = formData.get("status") as string;
  const zonaAtendimento = formData.get("zonaAtendimento") as string;

  try {
    await prisma.user.update({
      where: { id },
      data: { phone, status, zonaAtendimento },
    });
    revalidatePath("/dashboard/gestao/funcionarios");
  } catch (error) {
    console.error("Erro ao atualizar funcionário:", error);
    throw new Error("Não foi possível atualizar as informações.");
  }
}

// --- Gestão de Frota (Atribuições com Bloqueio de Segurança) ---

/**
 * Atribui um veículo a um funcionário.
 * A trava de segurança é feita no Banco de Dados (Postgres).
 * Se o veículo já estiver atribuído, o DB rejeita e o Prisma lança o erro P2002.
 */
export async function atribuirVeiculo(formData: FormData) {
  const userId = formData.get("userId") as string;
  const vehicleId = formData.get("vehicleId") as string;
  const reason = formData.get("reason") as string;

  try {
    // Transação atômica: ou salva tudo, ou nada é salvo (evita dados corrompidos)
    await prisma.$transaction(async (tx) => {
      // 1. Tenta inserir o vínculo.
      // Se já existir um registro com este vehicleId e endDate: null,
      // o índice único que criamos no SQL vai bloquear a operação.
      await tx.vehicleAssignment.create({
        data: {
          userId,
          vehicleId,
          reason,
          startDate: new Date(),
        },
      });

      // 2. Atualiza o status visual do veículo para EM_USO
      await tx.vehicle.update({
        where: { id: vehicleId },
        data: { status: "EM_USO" },
      });
    });

    // Atualiza as páginas para refletir o novo status
    revalidatePath(`/dashboard/gestao/funcionarios/${userId}`);
    revalidatePath("/dashboard/gestao/funcionarios");
  } catch (error: any) {
    console.error("Erro na atribuição:", error);

    // Tratamento de erro específico para duplicidade
    // P2002 é o código do Prisma para "Unique Constraint Violation"
    if (
      error.code === "P2002" ||
      error.message.includes("one_active_assignment_per_vehicle")
    ) {
      throw new Error(
        "BLOQUEIO: Este veículo já está vinculado a outro funcionário.",
      );
    }

    throw new Error("Falha ao atribuir veículo. Tente novamente mais tarde.");
  }
}

/**
 * Encerra o vínculo de um funcionário com um veículo.
 */
export async function encerrarVinculo(formData: FormData) {
  const assignmentId = formData.get("assignmentId") as string;
  const userId = formData.get("userId") as string;

  try {
    // Buscamos o vínculo atual para saber qual ID de veículo liberar
    const assignment = await prisma.vehicleAssignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) throw new Error("Atribuição não encontrada.");

    // Transação para finalizar a atribuição e liberar o veículo simultaneamente
    await prisma.$transaction([
      prisma.vehicleAssignment.update({
        where: { id: assignmentId },
        data: { endDate: new Date() },
      }),
      prisma.vehicle.update({
        where: { id: assignment.vehicleId },
        data: { status: "DISPONIVEL" },
      }),
    ]);

    revalidatePath(`/dashboard/gestao/funcionarios/${userId}`);
    revalidatePath("/dashboard/gestao/funcionarios");
  } catch (error) {
    console.error("Erro ao encerrar vínculo:", error);
    throw new Error("Falha ao encerrar vínculo.");
  }
}
