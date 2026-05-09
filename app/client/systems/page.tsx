import { getServerSession } from "next-auth";
import { Topbar } from "@/components/app/topbar";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export default async function ClientSystems(){ const session=await getServerSession(authOptions); const companyId=(session?.user as any)?.companyId; const systems=await prisma.clientSystem.findMany({where:{companyId}}); return <><Topbar title="Sistemas Contratados"/><div className="grid gap-4 p-5 md:grid-cols-2">{systems.map(s=><article className="card" key={s.id}><span className="text-xs text-cyan-400">{s.type}</span><h2 className="mt-2 text-lg font-semibold">{s.name}</h2><p className="mt-3 text-sm text-slate-500">{s.description}</p>{s.productionUrl && <a className="mt-4 inline-block text-sm text-cyan-400" href={s.productionUrl}>Acessar produção</a>}</article>)}</div></> }
