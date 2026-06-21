import { prisma } from "@/lib/prisma";
import VeiculosTable from "./components/VeiculosTable"; // Mantenha seu componente aqui
import { Car } from "lucide-react";

export default async function VeiculosPage() {
  const veiculos = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-10 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      {/* Cabeçalho Premium */}
      <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">Frota de Veículos</h1>
          <p className="text-gray-400 font-medium">
            Controle total da sua frota e status operacional.
          </p>
        </div>
      </div>

      {/* Tabela com o novo visual */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8">
        <VeiculosTable veiculos={veiculos} />
      </div>
    </div>
  );
}
