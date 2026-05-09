import { getServerSession } from "next-auth";
import { Bell, Search } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { ThemeToggle } from "./theme-toggle";
import { SignOutButton } from "./sign-out-button";

export async function Topbar({ title }: { title: string }) {
  const session = await getServerSession(authOptions);
  return <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/85 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-[#06111F]/80">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold tracking-tight">{title}</h1><p className="text-sm text-slate-500 dark:text-slate-400">Central inteligente de chamados e suporte técnico da Agência Pulsari</p></div>
    <div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900 md:flex"><Search className="h-4 w-4"/>Buscar</div><button className="btn btn-secondary"><Bell className="h-4 w-4"/></button><ThemeToggle/><span className="hidden text-right text-xs sm:block"><b className="block">{session?.user?.name ?? "Usuário"}</b><span className="text-slate-500">{(session?.user as any)?.role}</span></span><SignOutButton/></div></div>
  </header>;
}
