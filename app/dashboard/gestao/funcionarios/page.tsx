import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  Plus,
  Users,
  Search,
  ChevronRight,
  UserCircle,
  Car,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FuncionariosPage() {
  // Buscamos os usuários e incluímos o vínculo de frota atual (onde endDate é nulo)
  const users = await prisma.user.findMany({
    include: {
      assignments: {
        where: { endDate: null },
        include: { vehicle: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-700 bg-gray-50 min-h-screen">
      {/* HEADER E AÇÃO PRINCIPAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-950 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={36} /> Colaboradores
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Gestão de equipe e controle de prontuário de frota.
          </p>
        </div>

        <Link
          href="/dashboard/gestao/funcionarios/novo"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-4xl font-black flex items-center gap-2 transition-all shadow-lg shadow-blue-200 hover:scale-[1.02] cursor-pointer"
        >
          <Plus size={20} /> Adicionar Colaborador
        </Link>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative group">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          size={20}
        />
        <input
          type="text"
          title="Pesquisar funcionários"
          placeholder="Pesquisar por nome, e-mail ou zona..."
          className="w-full bg-white border border-gray-200 rounded-4xl py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-500 transition-all font-medium text-gray-950 shadow-sm"
        />
      </div>

      {/* TABELA PREMIUM */}
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-gray-500">
                  Colaborador
                </th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-gray-500">
                  Veículo Vinculado
                </th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-gray-500">
                  Zona
                </th>
                <th className="px-8 py-6 text-[11px] font-black uppercase tracking-widest text-gray-500 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                const activeAssignment = user.assignments[0];
                return (
                  <tr
                    key={user.id}
                    className="group hover:bg-blue-50/30 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-4xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <UserCircle size={28} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-950">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* COLUNA DO VEÍCULO ATUALIZADA */}
                    <td className="px-8 py-6">
                      {activeAssignment ? (
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-50 p-2 rounded-2xl text-blue-600">
                            <Car size={18} />
                          </div>
                          <div>
                            <p className="font-black text-gray-950">
                              {activeAssignment.vehicle.modelo}
                            </p>
                            <p className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                              {activeAssignment.vehicle.placa}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 font-medium italic text-sm">
                          Disponível
                        </span>
                      )}
                    </td>

                    <td className="px-8 py-6">
                      <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-2xl border border-gray-200 text-sm">
                        {user.zonaAtendimento || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Link
                        href={`/dashboard/gestao/funcionarios/${user.id}`}
                        className="inline-flex items-center gap-2 text-blue-600 font-black hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        Gerenciar <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
