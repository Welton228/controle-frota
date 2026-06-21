"use client";

import { useState, useTransition } from "react";
import { updateUser } from "../actions";

export default function UserRow({ user }: { user: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await updateUser(formData);
      setIsEditing(false); // Fecha o modo edição após salvar
    });
  };

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b">
      <td className="px-6 py-4">
        <div className="font-medium text-slate-900">{user.name}</div>
        <div className="text-xs text-slate-500">{user.email}</div>
      </td>

      {isEditing ? (
        // MODO EDIÇÃO
        <td colSpan={4} className="px-6 py-4">
          <form action={handleSubmit} className="flex gap-2 items-center">
            <input type="hidden" name="id" value={user.id} />
            <input
              name="phone"
              defaultValue={user.phone}
              className="border p-1 rounded w-full text-sm"
              placeholder="WhatsApp"
            />
            <select
              name="status"
              defaultValue={user.status}
              className="border p-1 rounded text-sm bg-white"
              aria-label={`Status do funcionário ${user.name}`}
              title="Status do funcionário"
            >
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
            </select>
            <input
              name="zonaAtendimento"
              defaultValue={user.zonaAtendimento}
              className="border p-1 rounded w-full text-sm"
              placeholder="Zona"
            />

            <button
              type="submit"
              disabled={isPending}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700"
            >
              {isPending ? "..." : "Salvar"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-slate-500 px-3 py-1 rounded text-xs hover:text-red-600"
            >
              Cancelar
            </button>
          </form>
        </td>
      ) : (
        // MODO VISUALIZAÇÃO (LEITURA)
        <>
          <td className="px-6 py-4 text-sm text-slate-600">
            {user.phone || "-"}
          </td>
          <td className="px-6 py-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "ATIVO" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {user.status}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-slate-600">
            {user.zonaAtendimento || "-"}
          </td>
          <td className="px-6 py-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Editar
            </button>
          </td>
        </>
      )}
    </tr>
  );
}
