"use client";

export default function FilterForm() {
  // Bloqueia caracteres não numéricos (como '-' ou 'e') em campos de zona
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["-", "e", "+"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white p-8 rounded-4xl shadow-xl border border-gray-100">
      <h2 className="text-xl font-black text-gray-950 mb-6 flex items-center gap-2">
        Filtros Avançados
      </h2>
      <form
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        action="/dashboard/manutencao/lista"
        method="GET"
      >
        {/* Placa */}
        <div>
          <label htmlFor="filterPlaca" className="sr-only">
            Placa do veículo
          </label>
          <input
            id="filterPlaca"
            name="placa"
            placeholder="Placa do veículo..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-950 transition-all"
          />
        </div>

        {/* Zona */}
        <div>
          <label htmlFor="filterZona" className="sr-only">
            Zona
          </label>
          <input
            id="filterZona"
            name="zona"
            type="number"
            min="0"
            onKeyDown={handleKeyDown}
            placeholder="Zona (01-100)..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-950 transition-all"
          />
        </div>

        {/* Nome */}
        <div>
          <label htmlFor="filterNome" className="sr-only">
            Nome do Vendedor
          </label>
          <input
            id="filterNome"
            name="nome"
            placeholder="Nome do Vendedor..."
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-950 transition-all"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-950 text-white rounded-2xl font-black hover:bg-gray-800 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
        >
          Filtrar Resultados
        </button>
      </form>
    </div>
  );
}
