"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Certifique-se de importar sua configuração de auth

// Validação de segurança: Impede anos absurdos (anteriores a 1900 ou futuros distantes)
const validateAno = (ano: number) => {
  const currentYear = new Date().getFullYear();
  return !isNaN(ano) && ano >= 1900 && ano <= currentYear + 1;
};

/**
 * Cria um novo veículo na frota.
 */
export async function createVehicle(formData: FormData) {
  // Segurança: Verifica se o usuário está autenticado
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado.");

  const placa = (formData.get("placa") as string)?.toUpperCase().trim();
  const modelo = (formData.get("modelo") as string)?.trim();
  const ano = parseInt(formData.get("ano") as string);

  if (!placa || !modelo || !validateAno(ano)) {
    throw new Error("Dados inválidos. Verifique a placa, o modelo e o ano.");
  }

  try {
    // Verifica duplicidade antes de inserir
    const existing = await prisma.vehicle.findUnique({ where: { placa } });
    if (existing) throw new Error("Já existe um veículo com esta placa.");

    await prisma.vehicle.create({
      data: { placa, modelo, ano, status: "DISPONIVEL" },
    });

    revalidatePath("/dashboard/veiculos");
  } catch (error) {
    console.error("Erro ao criar veículo:", error);
    throw new Error("Falha ao cadastrar veículo.");
  }
}

/**
 * Atualiza os dados de um veículo existente.
 */
export async function updateVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado.");

  const id = formData.get("id") as string;
  const placa = (formData.get("placa") as string)?.toUpperCase().trim();
  const modelo = (formData.get("modelo") as string)?.trim();
  const ano = parseInt(formData.get("ano") as string);

  if (!id || !validateAno(ano)) {
    throw new Error("Dados de atualização inválidos.");
  }

  try {
    await prisma.vehicle.update({
      where: { id },
      data: { placa, modelo, ano },
    });

    revalidatePath("/dashboard/veiculos");
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error);
    throw new Error("Não foi possível atualizar o veículo.");
  }
}

/**
 * Remove um veículo da frota.
 */
export async function deleteVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Não autorizado.");

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID do veículo não encontrado.");

  try {
    await prisma.vehicle.delete({ where: { id } });
    revalidatePath("/dashboard/veiculos");
  } catch (error) {
    console.error("Erro ao excluir veículo:", error);
    throw new Error(
      "Não foi possível excluir o veículo. Verifique se ele possui dependências.",
    );
  }
}
