import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HistoricoPage({
  searchParams,
}: {
  searchParams: Promise<{ nome?: string; placa?: string; zona?: string }>;
}) {
  const params = await searchParams;

  // Filtros dinâmicos no Prisma
  const historico = await prisma.vehicleAssignment.findMany({
    where: {
      user: params.nome
        ? { name: { contains: params.nome, mode: "insensitive" } }
        : {},
      vehicle: {
        placa: params.placa
          ? { contains: params.placa, mode: "insensitive" }
          : undefined,
        // Supondo que você tenha esse campo no modelo Vehicle
        zonaAtendimento: params.zona
          ? { contains: params.zona, mode: "insensitive" }
          : undefined,
      },
    },
    include: { user: true, vehicle: true },
    orderBy: { startDate: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 bg-slate-50 min-h-screen">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Histórico de Atribuições
        </h1>
      </header>

      {/* Formulário de Filtros */}
      <form className="bg-white p-6 rounded-2xl border shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <input
          name="nome"
          placeholder="Nome do funcionário"
          className="border p-3 rounded-lg"
          defaultValue={params.nome}
        />
        <input
          name="placa"
          placeholder="Placa do veículo"
          className="border p-3 rounded-lg"
          defaultValue={params.placa}
        />
        <input
          name="zona"
          placeholder="Zona"
          className="border p-3 rounded-lg"
          defaultValue={params.zona}
        />
        <button
          type="submit"
          className="bg-slate-900 text-white p-3 rounded-lg font-bold"
        >
          Filtrar
        </button>
      </form>

      {/* Tabela de Histórico */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-500">
            <tr>
              <th className="px-6 py-4">Funcionário</th>
              <th className="px-6 py-4">Veículo (Placa)</th>
              <th className="px-6 py-4">Início</th>
              <th className="px-6 py-4">Fim</th>
              <th className="px-6 py-4">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {historico.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-bold text-slate-900">
                  {a.user.name}
                </td>
                <td className="px-6 py-4">{a.vehicle.placa}</td>
                <td className="px-6 py-4 text-slate-600">
                  {a.startDate.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {a.endDate ? (
                    a.endDate.toLocaleDateString()
                  ) : (
                    <span className="text-emerald-600 font-black">Em uso</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500 italic">
                  {a.reason || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
