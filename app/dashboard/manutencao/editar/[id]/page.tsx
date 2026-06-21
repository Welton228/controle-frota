import { prisma } from "@/lib/prisma";
import { BackButton } from "@/components/ui/BackButton";
import EditMaintenanceForm from "../../components/EditMaintenanceForm";
import { notFound } from "next/navigation";

export default async function EditMaintenancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Busca a manutenção específica
  const maintenance = await prisma.maintenance.findUnique({
    where: { id },
    include: { vehicle: true },
  });

  if (!maintenance) notFound();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        {/* Botão de voltar para a página de histórico (lista) */}
        <BackButton />
        <h1 className="text-3xl font-black text-gray-950">Editar Manutenção</h1>
      </div>

      <EditMaintenanceForm maintenance={maintenance} />
    </div>
  );
}
