"use client"; // Necessário pois usamos hooks do Next.js

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Componente: BackButton
 * Objetivo: Botão de navegação inteligente que retorna para a página anterior na pilha do navegador.
 */
export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()} // Volta uma página no histórico do navegador
      // Adicionado 'cursor-pointer' para garantir a indicação visual de clique
      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-950 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      <ArrowLeft size={16} className="text-gray-500" />
      Voltar
    </button>
  );
}
