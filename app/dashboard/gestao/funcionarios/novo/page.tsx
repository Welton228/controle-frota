import { createUser } from "../actions";
import { BackButton } from "@/components/ui/BackButton";
import { UserPlus, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function NovoFuncionarioPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 animate-in slide-in-from-bottom-10 duration-700">
      {/* BOTÃO VOLTAR */}
      <Link
        href="/dashboard/gestao/funcionarios"
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />{" "}
        Voltar para a lista
      </Link>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="bg-slate-950 p-10 text-white">
          <div className="flex items-center gap-4 mb-2 text-blue-400">
            <UserPlus size={32} />
            <span className="font-black uppercase tracking-widest text-xs">
              Novo Cadastro
            </span>
          </div>
          <h1 className="text-4xl font-black">Adicionar Colaborador</h1>
          <p className="text-slate-400 mt-2 font-medium">
            Preencha os dados abaixo para iniciar o registro no sistema.
          </p>
        </div>

        <form action={createUser} className="p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* NOME */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wide ml-1">
                Nome Completo
              </label>
              <input
                name="name"
                required
                placeholder="Ex: Welton Coelho"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wide ml-1">
                E-mail Corporativo
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="welton@empresa.com"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            {/* WHATSAPP */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wide ml-1">
                WhatsApp / Telefone
              </label>
              <input
                name="phone"
                placeholder="(48) 9 9999-9999"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>

            {/* ZONA */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 uppercase tracking-wide ml-1">
                Zona de Atendimento
              </label>
              <input
                name="zonaAtendimento"
                placeholder="Ex: Z-10 / NORTE"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 outline-none focus:border-blue-500 transition-all font-bold"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <ShieldCheck size={18} />
              Dados protegidos por criptografia
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
