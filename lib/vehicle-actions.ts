"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function atribuirVeiculo(formData: FormData) {
  // Extraímos tudo do FormData
  const vehicleId = formData.get("vehicleId") as string;
  const userId = formData.get("userId") as string;
  const reason = formData.get("reason") as string;

  if (!vehicleId || !userId) return;

  // 1. Encerra vínculo anterior
  await prisma.vehicleAssignment.updateMany({
    where: { vehicleId, endDate: null },
    data: { endDate: new Date() },
  });

  // 2. Cria novo vínculo
  await prisma.vehicleAssignment.create({
    data: { vehicleId, userId, reason },
  });

  revalidatePath(`/dashboard/funcionarios/${userId}`);
}
export async function encerrarVinculo(formData: FormData) {
  const assignmentId = formData.get("assignmentId") as string;
  const userId = formData.get("userId") as string;

  await prisma.vehicleAssignment.update({
    where: { id: assignmentId },
    data: { endDate: new Date() },
  });

  revalidatePath(`/dashboard/funcionarios/${userId}`);
}
