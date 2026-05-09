import { Topbar } from "@/components/app/topbar";
import { PriorityBadge, TicketStatusBadge } from "@/components/app/badges";
import { addTicketComment, registerHours, updateTicketMeta } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { minutesToHours } from "@/lib/utils";

export default async function TicketDetail({ params }: { params: { id: string } }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      company: { include: { contracts: true, balances: true } },
      system: true,
      requester: true,
      assignee: true,
      comments: { include: { user: true }, orderBy: { createdAt: "asc" } },
      histories: { include: { user: true }, orderBy: { createdAt: "desc" } },
      hourEntries: { include: { user: true }, orderBy: { date: "desc" } },
    },
  });

  if (!ticket) return null;

  return (
    <>
      <Topbar title={`${ticket.code} · ${ticket.title}`} />
      <div className="grid gap-5 p-5 xl:grid-cols-[1fr_380px]">
        <main className="space-y-5">
          <section className="card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-3 flex gap-2">
                  <TicketStatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h2 className="text-2xl font-bold">{ticket.title}</h2>
                <p className="mt-2 text-slate-500">
                  {ticket.company.name} · {ticket.system?.name ?? "Sem sistema"} · Solicitante: {ticket.requester.name}
                </p>
              </div>

              <form action={updateTicketMeta} className="flex flex-wrap gap-2">
                <input type="hidden" name="ticketId" value={ticket.id} />
                <select name="status" className="input" defaultValue={ticket.status}>
                  <option value="NEW">Novo</option>
                  <option value="TRIAGE">Em triagem</option>
                  <option value="IN_PROGRESS">Em atendimento</option>
                  <option value="WAITING_CLIENT">Aguardando cliente</option>
                  <option value="DEVELOPMENT">Em desenvolvimento</option>
                  <option value="TESTING">Em teste</option>
                  <option value="RESOLVED">Resolvido</option>
                </select>
                <select name="priority" className="input" defaultValue={ticket.priority}>
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="CRITICAL">Crítica</option>
                </select>
                <button className="btn btn-primary">Salvar</button>
              </form>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
              <h3 className="font-semibold">Descrição</h3>
              <p className="mt-2 whitespace-pre-wrap text-sm">{ticket.description}</p>
            </div>
          </section>

          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">Comentários</h2>
            <div className="space-y-3">
              {ticket.comments.map((comment) => (
                <article key={comment.id} className="rounded-2xl border border-slate-200 p-4 dark:border-white/10">
                  <div className="mb-2 flex justify-between text-xs text-slate-500">
                    <b>{comment.user.name}</b>
                    <span>{comment.type === "INTERNAL" ? "Interno" : "Público"}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </article>
              ))}
            </div>

            <form action={addTicketComment} className="mt-4 space-y-3">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <textarea className="input" name="content" placeholder="Responder cliente ou adicionar nota interna" required />
              <select className="input" name="type">
                <option value="PUBLIC">Comentário público</option>
                <option value="INTERNAL">Comentário interno</option>
              </select>
              <button className="btn btn-primary">Adicionar comentário</button>
            </form>
          </section>
        </main>

        <aside className="space-y-5">
          <section className="card">
            <h2 className="text-lg font-semibold">Registrar horas</h2>
            <form action={registerHours} className="mt-4 space-y-3">
              <input type="hidden" name="ticketId" value={ticket.id} />
              <input type="hidden" name="companyId" value={ticket.companyId} />
              <input className="input" name="durationMinutes" type="number" placeholder="Tempo em minutos" required />
              <select className="input" name="activityType">
                <option value="TRIAGE">Triagem</option>
                <option value="TECHNICAL_ANALYSIS">Análise técnica</option>
                <option value="BUG_FIX">Correção de bug</option>
                <option value="DEVELOPMENT">Desenvolvimento</option>
                <option value="TESTING">Teste</option>
              </select>
              <select className="input" name="billingType">
                <option value="DEDUCTIBLE">Descontável</option>
                <option value="NON_DEDUCTIBLE">Não descontável</option>
                <option value="EXTRA">Hora extra</option>
                <option value="COURTESY">Cortesia</option>
              </select>
              <textarea className="input" name="description" placeholder="Descrição da atuação" required />
              <button className="btn btn-primary w-full">Registrar baixa</button>
            </form>
            <p className="mt-3 text-sm text-slate-500">Total no chamado: {minutesToHours(ticket.totalMinutes)}</p>
          </section>

          <section className="card">
            <h2 className="mb-3 text-lg font-semibold">Timeline</h2>
            {ticket.histories.map((history) => (
              <div key={history.id} className="border-l border-cyan-400/40 pb-4 pl-4 text-sm">
                <b>{history.action}</b>
                <p className="text-slate-500">{history.description}</p>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </>
  );
}
