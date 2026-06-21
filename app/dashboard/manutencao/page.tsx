import { prisma } from "@/lib/prisma";
import MaintenanceForm from "./components/MaintenanceForm";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default async function ManutencaoPage() {
  const vehicles = await prisma.vehicle.findMany();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-950">Nova Manutenção</h1>

        <Link
          href="/dashboard/manutencao/lista"
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-950 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
        >
          <ClipboardList size={20} /> Ver Histórico
        </Link>
      </div>

      <MaintenanceForm vehicles={vehicles} />
    </div>
  );
}
