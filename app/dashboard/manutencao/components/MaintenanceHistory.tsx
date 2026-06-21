import { FileType } from "lucide-react";

export default function MaintenanceHistory({
  maintenances,
}: {
  maintenances: any[];
}) {
  if (maintenances.length === 0) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl text-center">
        <p className="text-gray-500">
          Nenhum registro de manutenção encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-950">
          Histórico de Manutenções
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {maintenances.length} registros
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-4 font-semibold text-gray-600">Veículo</th>
              <th className="pb-4 font-semibold text-gray-600">Data</th>
              <th className="pb-4 font-semibold text-gray-600">Tipo</th>
              <th className="pb-4 font-semibold text-gray-600">KM</th>
              <th className="pb-4 font-semibold text-gray-600">Valor</th>
              <th className="pb-4 font-semibold text-gray-600 text-right">
                Documento
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {maintenances.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Veículo - text-gray-950 aplicado */}
                <td className="py-4 text-gray-950 font-medium">
                  {m.vehicle?.placa || "N/A"}
                </td>

                {/* Data - text-gray-950 aplicado */}
                <td className="py-4 text-gray-950">
                  {new Date(m.dataManutencao).toLocaleDateString("pt-BR")}
                </td>

                {/* Tipo - Mantendo estilização condicional */}
                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      m.tipo === "PREVENTIVA"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {m.tipo}
                  </span>
                </td>

                {/* KM - Garantindo que não mostre negativo (Math.max) e text-gray-950 */}
                <td className="py-4 text-gray-950">
                  {Math.max(0, m.kmNoMomento || 0).toLocaleString("pt-BR")} km
                </td>

                {/* Valor - Garantindo que não mostre negativo e text-gray-950 */}
                <td className="py-4 text-gray-950 font-semibold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(Math.max(0, m.valor || 0))}
                </td>

                {/* Lógica de Anexo - Agora lê do array 'attachments' */}
                <td className="py-4 text-right">
                  {m.attachments && m.attachments.length > 0 ? (
                    <a
                      href={m.attachments[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                      <FileType size={16} />
                      {m.attachments[0].fileType || "Abrir"}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm italic">
                      Sem anexo
                    </span>
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
