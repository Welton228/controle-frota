"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Car, Wrench, Users } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Início", href: "/dashboard", icon: LayoutDashboard },
    { name: "Veículos", href: "/dashboard/veiculos", icon: Car },
    { name: "Manutenção", href: "/dashboard/manutencao", icon: Wrench },
    {
      name: "Funcionários",
      href: "/dashboard/gestao/funcionarios",
      icon: Users,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-screen">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Frota<span className="text-blue-500">Master</span>
        </h1>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
