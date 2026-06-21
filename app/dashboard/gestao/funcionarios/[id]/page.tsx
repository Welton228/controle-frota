import { prisma } from "@/lib/prisma";
import { BackButton } from "@/components/ui/BackButton";
import { atribuirVeiculo, encerrarVinculo } from "../actions";
import { User, Car, ShieldCheck, History } from "lucide-react";

export default async function FuncionarioDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Busca paralela para eficiência.
  // A consulta de veículos agora filtra carros que NÃO estão em uso (assignments sem endDate).
  const [funcionario, veiculos] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        assignments: {
          include: { vehicle: true },
          orderBy: { startDate: "desc" },
        },
      },
    }),
    prisma.vehicle.findMany({
      where: {
        assignments: {
          none: {
            endDate: null, // Filtra apenas carros sem vínculo ativo (disponíveis)
          },
        },
      },
    }),
  ]);

  if (!funcionario) {
    return (
      <div className="p-10 text-center text-gray-500">
        Funcionário não encontrado.
      </div>
    );
  }

  // Verifica se existe um vínculo ativo (sem data de fim)
  const atribuicaoAtual = funcionario.assignments.find(
    (a) => a.endDate === null,
  );

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 animate-in fade-in duration-500 bg-gray-50 min-h-screen">
      <BackButton />

      {/* HEADER DO PERFIL */}
      <div className="bg-gray-950 rounded-4xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="p-5 bg-white/10 rounded-4xl">
            <User size={40} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {funcionario.name}
            </h1>
            <p className="text-blue-200 font-medium">{funcionario.email}</p>
          </div>
        </div>
      </div>

      {/* GESTÃO DE FROTA */}
      <div className="bg-white p-8 rounded-4xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-black text-gray-950 mb-6 flex items-center gap-2">
          <Car className="text-blue-600" /> Atribuição de Frota
        </h2>

        {atribuicaoAtual ? (
          /* CARD DE VEÍCULO EM USO */
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-4xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                  Veículo Atual
                </p>
                <p className="text-xl font-black text-emerald-950">
                  {atribuicaoAtual.vehicle.modelo} -{" "}
                  {atribuicaoAtual.vehicle.placa}
                </p>
              </div>
            </div>

            <form action={encerrarVinculo}>
              <input
                type="hidden"
                name="assignmentId"
                value={atribuicaoAtual.id}
              />
              <input type="hidden" name="userId" value={funcionario.id} />
              <button
                type="submit"
                className="bg-white border border-emerald-200 text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-100 transition shadow-sm cursor-pointer"
              >
                Encerrar Vínculo
              </button>
            </form>
          </div>
        ) : (
          /* FORMULÁRIO DE NOVA ATRIBUIÇÃO */
          <form
            action={atribuirVeiculo}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input type="hidden" name="userId" value={funcionario.id} />

            <select
              name="vehicleId"
              title="Selecione um veículo disponível"
              className="p-4 bg-gray-50 border border-gray-200 rounded-4xl font-bold text-gray-950 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              required
            >
              <option value="">Selecione um veículo disponível...</option>
              {veiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.modelo} ({v.placa})
                </option>
              ))}
            </select>

            <input
              name="reason"
              title="Motivo da atribuição"
              placeholder="Motivo (ex: Férias)..."
              className="p-4 bg-gray-50 border border-gray-200 rounded-4xl font-bold text-gray-950 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />

            <button
              type="submit"
              className="bg-gray-950 text-white rounded-4xl font-black hover:bg-gray-800 transition shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              Confirmar Atribuição
            </button>
          </form>
        )}
      </div>

      {/* HISTÓRICO DE ATRIBUIÇÕES */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 font-black text-gray-950 flex items-center gap-2">
          <History size={20} /> Histórico de Atribuições
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-500 tracking-widest">
            <tr>
              <th className="px-8 py-5">Veículo</th>
              <th className="px-8 py-5">Data Início</th>
              <th className="px-8 py-5">Data Fim</th>
              <th className="px-8 py-5">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {funcionario.assignments.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-all">
                <td className="px-8 py-6 font-bold text-gray-950">
                  {a.vehicle.placa}
                </td>
                <td className="px-8 py-6 text-gray-600">
                  {a.startDate.toLocaleDateString()}
                </td>
                <td className="px-8 py-6 font-medium text-gray-600">
                  {a.endDate ? (
                    a.endDate.toLocaleDateString()
                  ) : (
                    <span className="text-emerald-600 font-black">Em uso</span>
                  )}
                </td>
                <td className="px-8 py-6 text-gray-600 italic text-sm">
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
