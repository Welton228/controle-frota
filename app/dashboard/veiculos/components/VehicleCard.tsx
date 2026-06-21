"use client";
import { assignDriver } from "../../gestao/veiculos/actions";

export default function VehicleCard({
  vehicle,
  drivers,
}: {
  vehicle: any;
  drivers: any[];
}) {
  return (
    // Adicionamos 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
    // Isso faz o card "subir" quando o mouse passa por cima
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">{vehicle.placa}</h3>
          <p className="text-slate-500">
            {vehicle.modelo} • {vehicle.ano}
          </p>
        </div>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
          ATIVO
        </span>
      </div>

      <div className="mt-4 border-t pt-4">
        <p className="text-xs font-bold text-slate-400 uppercase mb-2">
          Motorista Atual
        </p>
        <p className="font-medium text-slate-800 mb-4">
          {vehicle.driver?.name || "Nenhum motorista"}
        </p>

        <form action={assignDriver} className="space-y-3">
          <input type="hidden" name="vehicleId" value={vehicle.id} />

          <select
            name="driverId"
            className="w-full border border-slate-200 p-2 rounded-lg text-sm cursor-pointer hover:border-blue-300 transition-colors"
            defaultValue={vehicle.driverId || ""}
            aria-label={`Selecionar motorista para ${vehicle.placa}`}
            title="Selecione um motorista"
          >
            <option value="">Trocar motorista...</option>
            {drivers.map((d: any) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Adicionamos 'active:scale-95 transition-transform duration-200' nos botões */}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all duration-200"
          >
            Atualizar Atribuição
          </button>
        </form>
      </div>
    </div>
  );
}
