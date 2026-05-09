import { Topbar } from "@/components/app/topbar";
import { prisma } from "@/lib/prisma";
import { currencyBRL } from "@/lib/utils";
export default async function Plans(){ const plans=await prisma.supportPlan.findMany(); return <><Topbar title="Planos de Suporte"/><div className="grid gap-4 p-5 md:grid-cols-3">{plans.map(p=><article className="card" key={p.id}><span className="text-sm text-cyan-400">{p.status}</span><h2 className="mt-2 text-2xl font-bold">{p.name}</h2><p className="mt-2 text-slate-500">{p.description}</p><p className="mt-6 text-3xl font-bold">{currencyBRL(String(p.monthlyPrice))}</p><p>{p.monthlyHours}h mensais</p><p className="mt-3 text-sm text-slate-500">Hora extra: {currencyBRL(String(p.extraHourPrice))}</p></article>)}</div></> }
