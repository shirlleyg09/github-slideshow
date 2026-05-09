import Link from "next/link";
import { BarChart3, BookOpen, Building2, Clock3, KanbanSquare, LifeBuoy, MonitorCog, Settings, ShieldCheck, Ticket, Users } from "lucide-react";

const teamItems = [
  ["Dashboard", "/dashboard", BarChart3], ["Chamados", "/tickets", Ticket], ["Kanban", "/kanban", KanbanSquare], ["Clientes", "/clients", Building2], ["Sistemas", "/systems", MonitorCog], ["Planos de Suporte", "/support-plans", ShieldCheck], ["Banco de Horas", "/hours", Clock3], ["Relatórios", "/reports", BarChart3], ["Base de Conhecimento", "/knowledge-base", BookOpen], ["Usuários", "/users", Users], ["Configurações", "/settings", Settings]
] as const;
const clientItems = [["Início", "/client/dashboard", BarChart3], ["Abrir Chamado", "/client/open-ticket", LifeBuoy], ["Meus Chamados", "/client/tickets", Ticket], ["Sistemas", "/client/systems", MonitorCog], ["Horas", "/client/hours", Clock3], ["Base", "/client/knowledge-base", BookOpen], ["Perfil", "/client/profile", Users]] as const;

export function AppSidebar({ area = "team" }: { area?: "team" | "client" }) {
  const items = area === "team" ? teamItems : clientItems;
  return <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-950/80 lg:block">
    <Link href={area === "team" ? "/dashboard" : "/client/dashboard"} className="mb-8 flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-fuchsia-500 font-black text-white shadow-glow">P</span>
      <span><strong className="block text-lg">Pulsari Desk</strong><small className="text-slate-500 dark:text-slate-400">Suporte inteligente</small></span>
    </Link>
    <nav className="space-y-1">{items.map(([label, href, Icon]) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-cyan-400/10 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"><Icon className="h-4 w-4" />{label}</Link>)}</nav>
  </aside>;
}
