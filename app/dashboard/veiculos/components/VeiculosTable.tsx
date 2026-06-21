"use client";

import { useState } from "react";
import Link from "next/link";
import { History, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { createVehicle, updateVehicle, deleteVehicle } from "../actions";

const inputStyle =
  "border border-gray-300 rounded-xl p-3 text-gray-950 bg-gray-50/50 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all";

export default function VeiculosTable({ veiculos }: { veiculos: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {/* Formulário de Cadastro */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <h2 className="text-xl font-bold text-gray-900">
          Adicionar Novo Veículo
        </h2>
        <form
          action={createVehicle}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
        >
          <input
            name="placa"
            placeholder="Placa"
            className={inputStyle}
            aria-label="Placa do veículo"
            title="Placa do veículo"
            required
          />
          <input
            name="modelo"
            placeholder="Modelo"
            className={inputStyle}
            aria-label="Modelo do veículo"
            title="Modelo do veículo"
            required
          />
          <input
            name="ano"
            type="number"
            min="1900"
            placeholder="Ano"
            className={inputStyle}
            aria-label="Ano do veículo"
            title="Ano do veículo"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer shadow-lg shadow-blue-200"
            aria-label="Cadastrar novo veículo"
            title="Cadastrar novo veículo"
          >
            <Plus size={20} className="inline mr-2" /> Cadastrar
          </button>
        </form>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-600 font-bold">
            <tr>
              <th className="px-8 py-5">Placa</th>
              <th className="px-8 py-5">Modelo</th>
              <th className="px-8 py-5">Ano</th>
              <th className="px-8 py-5">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {veiculos.map((v) => (
              <tr key={v.id} className="hover:bg-gray-50/50 transition">
                {editingId === v.id ? (
                  <td colSpan={4} className="p-0">
                    <form
                      action={updateVehicle}
                      className="flex px-8 py-4 gap-6 items-center"
                      onSubmit={() => setEditingId(null)}
                    >
                      <input name="id" type="hidden" value={v.id} />
                      <input
                        name="placa"
                        defaultValue={v.placa}
                        className={`${inputStyle} text-sm w-36`}
                        aria-label="Editar placa"
                        required
                      />
                      <input
                        name="modelo"
                        defaultValue={v.modelo}
                        className={`${inputStyle} text-sm flex-1`}
                        aria-label="Editar modelo"
                        required
                      />
                      <input
                        name="ano"
                        type="number"
                        defaultValue={v.ano}
                        className={`${inputStyle} text-sm w-24`}
                        aria-label="Editar ano"
                        required
                      />
                      <div className="flex gap-2 ml-auto">
                        <button
                          type="submit"
                          aria-label="Salvar alterações"
                          title="Salvar"
                          className="text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          aria-label="Cancelar edição"
                          title="Cancelar"
                          className="text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="px-8 py-5 font-bold text-gray-950">
                      {v.placa}
                    </td>
                    <td className="px-8 py-5 text-gray-900">{v.modelo}</td>
                    <td className="px-8 py-5 text-gray-900">{v.ano}</td>
                    <td className="px-8 py-5 flex gap-4">
                      <Link
                        href={`/dashboard/veiculos/historico/${v.id}`}
                        aria-label="Ver histórico"
                        title="Ver histórico do veículo"
                        className="text-gray-400 hover:text-blue-600 transition cursor-pointer"
                      >
                        <History size={20} />
                      </Link>
                      <button
                        onClick={() => setEditingId(v.id)}
                        aria-label="Editar veículo"
                        title="Editar"
                        className="text-gray-400 hover:text-amber-600 transition cursor-pointer"
                      >
                        <Pencil size={20} />
                      </button>
                      <form action={deleteVehicle}>
                        <input type="hidden" name="id" value={v.id} />
                        <button
                          type="submit"
                          aria-label="Excluir veículo"
                          title="Excluir"
                          className="text-gray-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <Trash2 size={20} />
                        </button>
                      </form>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
