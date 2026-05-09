import Link from "next/link";
import { getServerSession } from "next-auth";
import { Topbar } from "@/components/app/topbar";
import { StatCard } from "@/components/app/stat-card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { minutesToHours } from "@/lib/utils";
export default async function ClientDashboard(){ const session=await getServerSession(authOptions); const companyId=(session?.user as any)?.companyId; const [tickets,systems,balance]=await Promise.all([prisma.ticket.findMany({where:{companyId},orderBy:{createdAt:"desc"},take:5}),prisma.clientSystem.count({where:{companyId}}),prisma.supportHourBalance.findFirst({where:{companyId}})]); return <><Topbar title="Início do cliente"/><div className="space-y-5 p-5"><div className="grid gap-4 md:grid-cols-4"><StatCard title="Chamados abertos" value={tickets.filter(t=>t.status!=="RESOLVED").length}/><StatCard title="Resolvidos" value={tickets.filter(t=>t.status==="RESOLVED").length}/><StatCard title="Sistemas" value={systems}/><StatCard title="Horas restantes" value={balance?minutesToHours(balance.remainingMinutes):"—"}/></div><Link className="btn btn-primary" href="/client/open-ticket">Abrir chamado</Link><section className="card"><h2 className="mb-4 text-lg font-semibold">Últimos chamados</h2>{tickets.map(t=><a className="block rounded-xl border border-slate-200 p-3 dark:border-white/10" key={t.id} href={`/client/tickets/${t.id}`}>{t.code} · {t.title}</a>)}</section></div></> }
