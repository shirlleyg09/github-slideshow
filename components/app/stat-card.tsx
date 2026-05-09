import type { LucideIcon } from "lucide-react";
export function StatCard({ title, value, helper, icon: Icon }: { title: string; value: string | number; helper?: string; icon?: LucideIcon }) {
  return <div className="card"><div className="flex items-start justify-between gap-3"><div><p className="text-sm text-slate-500 dark:text-slate-400">{title}</p><strong className="mt-2 block text-3xl">{value}</strong>{helper && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{helper}</p>}</div>{Icon && <div className="rounded-2xl bg-cyan-400/15 p-3 text-cyan-400"><Icon className="h-5 w-5"/></div>}</div></div>;
}
