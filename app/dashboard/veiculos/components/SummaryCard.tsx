/**
 * Componente: SummaryCard
 * Objetivo: Exibir métricas de desempenho (KPIs) de forma padronizada.
 * Utilizado nos Dashboards de veículos.
 */

interface SummaryCardProps {
  title: string; // Título do indicador (ex: "KM Atual")
  value: string; // Valor formatado do indicador (ex: "50.000 km" ou "R$ 1.500,00")
}

export function SummaryCard({ title, value }: SummaryCardProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1 transition-all hover:border-blue-100">
      {/* Título do indicador: Pequeno, cinza para reduzir distração visual */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      
      {/* Valor do indicador: Grande, preto (gray-950) para leitura rápida e contraste */}
      <p className="text-2xl font-black text-gray-950">
        {value}
      </p>
    </div>
  );
}