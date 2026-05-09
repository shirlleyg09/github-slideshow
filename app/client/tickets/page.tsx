import { getServerSession } from "next-auth";
import { Topbar } from "@/components/app/topbar";
import { PriorityBadge, TicketStatusBadge } from "@/components/app/badges";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function ClientTickets(){ const session=await getServerSession(authOptions); const companyId=(session?.user as any)?.companyId; const tickets=await prisma.ticket.findMany({where:{companyId},include:{system:true},orderBy:{createdAt:"desc"}}); return <><Topbar title="Meus Chamados"/><div className="p-5"><section className="card"><h2 className="mb-4 text-lg font-semibold">Chamados da sua empresa</h2><div className="space-y-3">{tickets.map(t=><a href={`/client/tickets/${t.id}`} key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-white/10"><div><b>{t.code} · {t.title}</b><p className="text-sm text-slate-500">{t.system?.name ?? "Sem sistema"}</p></div><div className="flex gap-2"><TicketStatusBadge status={t.status}/><PriorityBadge priority={t.priority}/></div></a>)}</div></section></div></> }
