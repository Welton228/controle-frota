import { prisma } from "@/lib/prisma";
import { BackButton } from "@/components/ui/BackButton";
import { notFound } from "next/navigation";
import { Card, Metric, Text, Grid, Title } from "@tremor/react";

// Definição de tipo para o nosso Feed Unificado
type Activity = {
  id: string;
  type: "MANUTENCAO" | "COMBUSTIVEL";
  date: Date;
  description: string;
  value: number;
};

export default async function DetalhesVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Busca do veículo com as relações de manutenção e combustível
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      maintenances: { orderBy: { dataManutencao: "desc" } },
      fuelLogs: { orderBy: { data: "desc" } },
    },
  });

  if (!vehicle) notFound();

  // --- Lógica de Filtros (30 dias) ---
  const agora = new Date();
  const trintaDiasAtras = new Date();
  trintaDiasAtras.setDate(agora.getDate() - 30);

  const fuelLogs = vehicle.fuelLogs ?? [];
  const maintenances = vehicle.maintenances ?? [];

  // Cálculos financeiros com segurança (evitando null)
  const totalGastoCombustivel = fuelLogs.reduce(
    (acc, curr) => acc + (curr.valorTotal || 0),
    0,
  );

  const fuelMes = fuelLogs
    .filter((f) => f.data >= trintaDiasAtras)
    .reduce((acc, curr) => acc + (curr.valorTotal || 0), 0);

  const manutencaoMes = maintenances
    .filter((m) => m.dataManutencao >= trintaDiasAtras)
    .reduce((acc, curr) => acc + (curr.valor || 0), 0);

  // Unificação da Timeline para o histórico geral
  const activities: Activity[] = [
    ...maintenances.map((m) => ({
      id: m.id,
      type: "MANUTENCAO" as const,
      date: m.dataManutencao,
      description: m.descricao || "Manutenção realizada",
      value: m.valor ?? 0,
    })),
    ...fuelLogs.map((f) => ({
      id: f.id,
      type: "COMBUSTIVEL" as const,
      date: f.data,
      description: `Abastecimento (${f.litros} Litros)`,
      value: f.valorTotal ?? 0,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Função utilitária para formatar moeda
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho */}
      <div className="flex items-center gap-4">
        <BackButton />
        <h1 className="text-3xl font-black text-gray-950 tracking-tight">
          Detalhes: {vehicle.placa}
          <span className="text-gray-400 font-normal ml-3">
            {vehicle.modelo}
          </span>
        </h1>
      </div>

      {/* Cards de Métricas */}
      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card className="border-gray-100 shadow-sm">
          <Text className="text-gray-700 font-medium">KM Atual</Text>
          <Metric className="text-gray-950">
            {vehicle.maintenances[0]?.kmNoMomento?.toLocaleString("pt-BR") ||
              "0"}{" "}
            km
          </Metric>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <Text className="text-gray-700 font-medium">
            Combustível (30 dias)
          </Text>
          <Metric className="text-gray-950">{formatCurrency(fuelMes)}</Metric>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <Text className="text-gray-700 font-medium">
            Manutenção (30 dias)
          </Text>
          <Metric className="text-gray-950">
            {formatCurrency(manutencaoMes)}
          </Metric>
        </Card>
        <Card className="border-gray-100 shadow-sm">
          <Text className="text-gray-700 font-medium">
            Gasto Total (Histórico)
          </Text>
          <Metric className="text-gray-950">
            {formatCurrency(totalGastoCombustivel)}
          </Metric>
        </Card>
      </Grid>

      {/* Histórico Operacional */}
      <Card className="border-gray-100 shadow-sm">
        <Title className="text-gray-950 mb-6 font-black">
          Histórico Operacional
        </Title>
        <div className="space-y-6">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full shadow-sm ${activity.type === "MANUTENCAO" ? "bg-red-500" : "bg-blue-500"}`}
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-950">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {activity.date.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-950">
                  {formatCurrency(activity.value)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-10">
              Nenhum registro encontrado.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
