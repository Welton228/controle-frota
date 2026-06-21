import { prisma } from "@/lib/prisma";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, MapPin, Gauge, Fuel, Pencil, Lock } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";

export default async function HistoricoVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id)
    return (
      <div className="p-8 text-center text-gray-500 font-medium">
        ID inválido.
      </div>
    );

  const veiculo = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      driver: true,
      maintenances: { orderBy: { dataManutencao: "desc" } },
      fuelLogs: { orderBy: { data: "desc" } },
    },
  });

  if (!veiculo)
    return (
      <div className="p-8 text-center text-gray-500">
        Veículo não encontrado.
      </div>
    );

  // --- Lógica de Correção de Status ---
  // Verifica se existe alguma manutenção pendente (não concluída)
  const temManutencaoAberta = veiculo.maintenances.some((m) => !m.concluido);

  // Se o banco diz "MANUTENCAO" mas não tem nenhuma aberta, forçamos a exibição correta
  const statusExibido =
    veiculo.status === "MANUTENCAO" && !temManutencaoAberta
      ? "DISPONIVEL"
      : veiculo.status;

  // --- Cálculos ---
  const gastoMensal = veiculo.fuelLogs
    .filter((f) => new Date(f.data) >= subMonths(new Date(), 1))
    .reduce((acc, f) => acc + (Number(f.valorTotal) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 bg-gray-50 min-h-screen">
      <BackButton />

      {/* CARD DE DESTAQUE PREMIUM */}
      <div className="relative bg-gray-950 rounded-[2.5rem] p-10 shadow-2xl text-white overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-tr from-blue-900/20 to-transparent"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-black tracking-tighter">
                {veiculo.modelo}
              </h1>
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-blue-300">
                {veiculo.placa}
              </span>
            </div>

            <div className="flex gap-6 text-gray-300">
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <User size={18} className="text-blue-400" />
                <span className="font-medium">
                  {veiculo.driver?.name || "Sem motorista"}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <MapPin size={18} className="text-emerald-400" />
                <span className="font-medium">
                  Zona{" "}
                  {veiculo.zona ? String(veiculo.zona).padStart(2, "0") : "---"}
                </span>
              </div>
            </div>
          </div>

          {/* Badge de Status Corrigido */}
          <div
            className={`self-start px-6 py-3 rounded-2xl border font-black tracking-widest text-sm uppercase ${
              statusExibido === "DISPONIVEL"
                ? "bg-emerald-900/30 border-emerald-500/50 text-emerald-400"
                : "bg-amber-900/30 border-amber-500/50 text-amber-400"
            }`}
          >
            {statusExibido === "DISPONIVEL" ? "Disponível" : "Em Manutenção"}
          </div>
        </div>
      </div>

      {/* Tabela de Manutenções */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h2 className="text-xl font-black text-gray-950">
            Histórico de Manutenções
          </h2>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Data</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">KM</th>
              <th className="px-8 py-5">Valor</th>
              <th className="px-8 py-5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {veiculo.maintenances.map((m) => (
              <tr key={m.id} className="hover:bg-blue-50/50 transition-all">
                <td className="px-8 py-6 font-medium text-gray-700">
                  {format(m.dataManutencao, "dd MMM yyyy", { locale: ptBR })}
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${m.concluido ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {m.concluido ? "Concluído" : "Aberto"}
                  </span>
                </td>
                <td className="px-8 py-6 font-bold text-gray-700">
                  {m.kmNoMomento.toLocaleString()} km
                </td>
                <td className="px-8 py-6 font-black text-gray-950 text-lg">
                  R$ {Number(m.valor || 0).toFixed(2)}
                </td>
                <td className="px-8 py-6 text-center">
                  {!m.concluido ? (
                    <button
                      title="Editar"
                      className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-amber-500 hover:text-white transition-all cursor-pointer hover:scale-110"
                    >
                      <Pencil size={16} />
                    </button>
                  ) : (
                    <div className="text-[10px] font-black uppercase text-gray-300 flex justify-center items-center gap-1">
                      <Lock size={12} /> Bloqueado
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
