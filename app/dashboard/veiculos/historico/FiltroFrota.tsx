"use client";

import { useRouter } from "next/navigation";

export default function FiltroFrota({ motoristas }: { motoristas: any[] }) {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    if (formData.get("placa"))
      params.append("placa", formData.get("placa") as string);
    if (formData.get("zona"))
      params.append("zona", formData.get("zona") as string);
    if (formData.get("motoristaId"))
      params.append("motoristaId", formData.get("motoristaId") as string);

    router.push(`/dashboard/veiculos/historico?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      {/* Input Placa */}
      <input
        name="placa"
        placeholder="Filtrar por Placa..."
        aria-label="Filtrar por placa do veículo"
        title="Digite a placa do veículo para filtrar"
        className="border border-gray-300 rounded-xl p-3 text-gray-950 bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all"
      />

      {/* Seleção de Zona */}
      <select
        name="zona"
        aria-label="Selecionar zona"
        title="Selecione a zona do veículo"
        className="border border-gray-300 rounded-xl p-3 text-gray-950 bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
      >
        <option value="">Todas as Zonas</option>
        {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            Zona {num.toString().padStart(2, "0")}
          </option>
        ))}
      </select>

      {/* Seleção de Motorista */}
      <select
        name="motoristaId"
        aria-label="Selecionar vendedor"
        title="Selecione o vendedor para filtrar"
        className="border border-gray-300 rounded-xl p-3 text-gray-950 bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
      >
        <option value="">Todos os Vendedores</option>
        {motoristas.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      {/* Botão Buscar */}
      <button
        type="submit"
        aria-label="Realizar busca"
        title="Clique para buscar com os filtros selecionados"
        className="bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer shadow-lg shadow-blue-200 active:scale-95"
      >
        Buscar Histórico
      </button>
    </form>
  );
}
