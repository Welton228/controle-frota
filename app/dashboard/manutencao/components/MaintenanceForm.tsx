"use client";

import { registerMaintenance } from "../actions";

export default function MaintenanceForm({ vehicles }: { vehicles: any[] }) {
  // Função auxiliar para impedir caracteres inválidos em campos numéricos
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Bloqueia os caracteres: '-' (sinal de menos), 'e' (notação científica), '+'
    if (["-", "e", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <form
      action={registerMaintenance}
      className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6"
    >
      <h2 className="text-xl font-bold text-gray-950">Registrar Manutenção</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Veículo */}
        <div>
          <label
            htmlFor="vehicleId"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            Veículo
          </label>
          <select
            id="vehicleId"
            name="vehicleId"
            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50 cursor-pointer"
            required
            aria-label="Selecione o veículo"
          >
            <option value="">Selecione o veículo...</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id} className="cursor-pointer">
                {v.placa} - {v.modelo}
              </option>
            ))}
          </select>
        </div>

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
            onKeyDown={handleKeyDown} // Bloqueia caracteres não numéricos
            placeholder="Ex: 50000"
            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50"
            required
            aria-label="Quilometragem atual do veículo"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Manutenção */}
        <div>
          <label
            htmlFor="dataManutencao"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            Data da Manutenção
          </label>
          <input
            id="dataManutencao"
            name="dataManutencao"
            type="date"
            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50 cursor-pointer"
            required
            aria-label="Data em que a manutenção foi ou será realizada"
          />
        </div>

        {/* Previsão Retorno */}
        <div>
          <label
            htmlFor="dataPrevisao"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            Previsão de Retorno
          </label>
          <input
            id="dataPrevisao"
            name="dataPrevisao"
            type="date"
            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50 cursor-pointer"
            required
            aria-label="Data prevista para retorno do veículo"
          />
        </div>
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
          placeholder="Ex: Troca de óleo, revisão de freios..."
          className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50"
          rows={3}
          required
          aria-label="Descrição detalhada do serviço realizado"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo */}
        <div>
          <label
            htmlFor="tipo"
            className="block text-sm font-semibold text-gray-600 mb-2"
          >
            Tipo de Manutenção
          </label>
          <select
            id="tipo"
            name="tipo"
            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50 cursor-pointer"
            required
            aria-label="Selecione o tipo de manutenção"
          >
            <option value="PREVENTIVA" className="cursor-pointer">
              Preventiva
            </option>
            <option value="CORRETIVA" className="cursor-pointer">
              Corretiva
            </option>
          </select>
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
            onKeyDown={handleKeyDown} // Bloqueia caracteres não numéricos
            placeholder="0.00"
            className="w-full border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 text-gray-950 p-3 bg-gray-50"
            required
            aria-label="Custo da manutenção em reais"
          />
        </div>
      </div>

      {/* Upload de Arquivo */}
      <div className="pt-4 border-t border-gray-100">
        <label
          htmlFor="file"
          className="block text-sm font-semibold text-gray-600 mb-2"
        >
          Anexar Documento (XML ou PDF)
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept=".xml,.pdf"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 p-2 border border-gray-200 rounded-xl cursor-pointer"
          aria-label="Selecionar arquivo de nota fiscal ou comprovante"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 cursor-pointer"
      >
        Registrar Manutenção
      </button>
    </form>
  );
}
