import { cn, priorityLabel, statusLabel } from "@/lib/utils";
export function TicketStatusBadge({ status }: { status: string }) {
  const styles: Record<string,string> = { NEW:"bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-200", TRIAGE:"bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200", IN_PROGRESS:"bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200", WAITING_CLIENT:"bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200", DEVELOPMENT:"bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-400/15 dark:text-fuchsia-200", TESTING:"bg-indigo-100 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-200", RESOLVED:"bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200" };
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", styles[status] ?? "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200")}>{statusLabel(status)}</span>;
}
export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string,string> = { LOW:"bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200", MEDIUM:"bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200", HIGH:"bg-orange-100 text-orange-800 dark:bg-orange-400/15 dark:text-orange-200", CRITICAL:"bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-200" };
  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", styles[priority])}>{priorityLabel(priority)}</span>;
}
