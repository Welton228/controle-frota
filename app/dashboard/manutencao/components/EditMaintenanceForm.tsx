"use client";

import { updateMaintenance } from "../actions";

export default function EditMaintenanceForm({
  maintenance,
}: {
  maintenance: any;
}) {
  // Função para bloquear teclas indesejadas em campos numéricos
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["-", "e", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <form
      action={updateMaintenance}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6"
    >
      {/* Input oculto para identificar qual registro estamos editando */}
      <input type="hidden" name="id" value={maintenance.id} />

      <h2 className="text-xl font-bold text-gray-950">
        Detalhes da Manutenção
      </h2>

      {/* KM Atual */}
      <div>
        <label
          htmlFor="kmNoMomento"
          className="block text-sm font-semibold text-gray-600 mb-2"
        >
          KM Atual
        </label>
        <input
          id="kmNoMomento"
          name="kmNoMomento"
          type="number"
          min="0"
          onKeyDown={handleKeyDown}
          defaultValue={maintenance.kmNoMomento}
          className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50"
          required
          aria-label="Quilometragem atual do veículo"
        />
      </div>

      {/* Descrição */}
      <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-semibold text-gray-600 mb-2"
        >
          Descrição do Serviço
        </label>
        <textarea
          id="descricao"
          name="descricao"
          defaultValue={maintenance.descricao}
          className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50"
          rows={3}
          required
          aria-label="Descrição detalhada do serviço"
        />
      </div>

      {/* Valor */}
      <div>
        <label
          htmlFor="valor"
          className="block text-sm font-semibold text-gray-950 mb-2"
        >
          Valor (R$)
        </label>
        <input
          id="valor"
          name="valor"
          type="number"
          min="0"
          step="0.01"
          onKeyDown={handleKeyDown}
          defaultValue={maintenance.valor}
          className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50"
          required
          aria-label="Custo da manutenção em reais"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 cursor-pointer"
      >
        Salvar Alterações
      </button>
    </form>
  );
}
