import { prisma } from "@/lib/prisma";
import { BackButton } from "@/components/ui/BackButton";
import Link from "next/link";
// Adicionei o ícone "Eye" para visualizar detalhes
import { Pencil, Lock, FileText, Eye } from "lucide-react";
import FilterForm from "../components/FilterForm";

export default async function ListaManutencaoPage({
  searchParams,
}: {
  searchParams: Promise<{ placa?: string; zona?: string; nome?: string }>;
}) {
  const { placa, zona, nome } = await searchParams;

  // Busca as manutenções com os filtros aplicados
  const man = await prisma.maintenance.findMany({
    where: {
      vehicle: {
        placa: placa ? { contains: placa } : undefined,
        zona: zona ? { equals: parseInt(zona) } : undefined,
      },
      user: { name: nome ? { contains: nome } : undefined },
    },
    include: {
      vehicle: true,
      attachments: true,
    },
    orderBy: { dataManutencao: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      <BackButton />

      {/* Formulário de Filtros (Client Component isolado) */}
      <FilterForm />

      {/* Tabela de Listagem */}
      <div className="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] px-8">
            <tr>
              <th className="px-8 py-5">Veículo</th>
              <th className="px-8 py-5">Data</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Documento</th>
              <th className="px-8 py-5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {man.map((m) => (
              <tr key={m.id} className="hover:bg-blue-50/50 transition-all">
                <td className="px-8 py-6 font-black text-gray-950">
                  {m.vehicle.placa}
                </td>
                <td className="px-8 py-6 text-gray-950">
                  {m.dataManutencao.toLocaleDateString()}
                </td>
                <td className="px-8 py-6">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                      m.concluido
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {m.concluido ? "Concluído" : "Aberto"}
                  </span>
                </td>
                <td className="px-8 py-6">
                  {m.attachments && m.attachments.length > 0 ? (
                    <a
                      href={m.attachments[0].url}
                      target="_blank"
                      className="flex items-center gap-2 text-gray-950 hover:text-blue-600 font-semibold text-sm"
                    >
                      <FileText size={16} /> Abrir
                    </a>
                  ) : (
                    <span className="text-gray-300 text-xs italic">
                      Sem anexo
                    </span>
                  )}
                </td>

                {/* Coluna de Ações: Agora com botão de Detalhes + Botão de Edição */}
                <td className="px-8 py-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botão para ir para a nova página de Detalhes do Veículo */}
                    <Link
                      href={`/dashboard/veiculos/${m.vehicle.id}`}
                      className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-blue-600 hover:text-white transition-all inline-block"
                      title="Ver detalhes do veículo"
                    >
                      <Eye size={16} />
                    </Link>

                    {/* Botão de Edição (mantido a lógica original) */}
                    {!m.concluido ? (
                      <Link
                        href={`/dashboard/manutencao/editar/${m.id}`}
                        className="p-2 bg-gray-100 rounded-xl text-gray-500 hover:bg-amber-500 hover:text-white transition-all inline-block"
                        title="Editar manutenção"
                      >
                        <Pencil size={16} />
                      </Link>
                    ) : (
                      <div className="p-2 text-gray-300">
                        <Lock size={16} />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
