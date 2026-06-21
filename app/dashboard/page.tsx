// app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  // Consultas otimizadas ao banco de dados
  const totalVeiculos = await prisma.vehicle.count();
  const emManutencao = await prisma.vehicle.count({
    where: { status: "MANUTENCAO" },
  });
  const disponiveis = await prisma.vehicle.count({
    where: { status: "DISPONIVEL" },
  });

  return (
    <div className="space-y-8">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {session?.user?.name}
        </h1>
        <p className="text-gray-500">
          Aqui está o resumo operacional da sua frota.
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card Total */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 uppercase">
            Total de Veículos
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalVeiculos}
          </p>
        </div>

        {/* Card Disponíveis */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-medium text-green-600 uppercase">
            Disponíveis
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">{disponiveis}</p>
        </div>

        {/* Card Manutenção */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-sm font-medium text-amber-600 uppercase">
            Em Manutenção
          </h2>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {emManutencao}
          </p>
        </div>
      </div>

      {/* Área de Ações Rápidas (Espaço reservado para o futuro) */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h3 className="font-semibold text-blue-900">Dica de Gestão</h3>
        <p className="text-blue-700 text-sm mt-1">
          Você tem {emManutencao} veículos parados. Verifique se o cronograma de
          manutenção preventiva está em dia para evitar custos inesperados.
        </p>
      </div>
    </div>
  );
}
