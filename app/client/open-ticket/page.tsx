import { Topbar } from "@/components/app/topbar";
import { createTicket } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { requireClientUser } from "@/lib/permissions";

export default async function OpenTicket() {
  const user = await requireClientUser();
  const systems = await prisma.clientSystem.findMany({ where: { companyId: user.companyId } });

  return (
    <>
      <Topbar title="Abrir chamado" />
      <div className="p-5">
        <form action={createTicket} className="card mx-auto max-w-3xl space-y-5">
          <input type="hidden" name="companyId" value={user.companyId ?? ""} />

          <section>
            <h2 className="font-semibold">1. O que você precisa?</h2>
            <select name="category" className="input mt-2">
              <option value="SYSTEM_ERROR">Erro no sistema</option>
              <option value="USAGE_QUESTION">Dúvida de uso</option>
              <option value="CHANGE_REQUEST">Solicitação de ajuste</option>
              <option value="IMPROVEMENT">Solicitação de melhoria</option>
              <option value="ACCESS_PROBLEM">Problema de acesso</option>
              <option value="SLOWNESS">Lentidão</option>
              <option value="REPORT_DASHBOARD">Problema em relatório/dashboard</option>
              <option value="INTEGRATION_API">Problema em integração/API</option>
              <option value="PUBLISHING">Publicação/alteração</option>
              <option value="OTHER">Outro</option>
            </select>
          </section>

          <section>
            <h2 className="font-semibold">2. Onde aconteceu?</h2>
            <select name="systemId" className="input mt-2">
              <option value="">Não sei informar</option>
              {systems.map((system) => (
                <option key={system.id} value={system.id}>
                  {system.name}
                </option>
              ))}
            </select>
          </section>

          <section>
            <h2 className="font-semibold">3. Isso está impedindo seu trabalho?</h2>
            <select name="impact" className="input mt-2">
              <option value="LOW">Baixo: não impede o trabalho</option>
              <option value="MEDIUM">Médio: atrapalha, mas existe alternativa</option>
              <option value="HIGH">Alto: prejudica atividade importante</option>
              <option value="CRITICAL">Crítico: sistema parado ou impacto grave</option>
            </select>
          </section>

          <section className="grid gap-3">
            <h2 className="font-semibold">4. Conte o que aconteceu</h2>
            <input className="input" name="title" placeholder="Título do chamado" required />
            <textarea className="input" name="description" placeholder="O que aconteceu?" required />
            <input className="input" name="attemptedAction" placeholder="O que você estava tentando fazer?" />
            <input className="input" name="actualResult" placeholder="O que aconteceu na tela?" />
            <input className="input" name="expectedResult" placeholder="O que você esperava que acontecesse?" />
            <input className="input" name="occursSince" placeholder="Desde quando ocorre?" />
            <input className="input" name="affectedUsers" placeholder="Quais usuários foram afetados?" />
          </section>

          <section>
            <h2 className="font-semibold">5. Você consegue enviar um print?</h2>
            <div className="mt-2 rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500 dark:border-white/10">
              Upload local preparado para próxima etapa do MVP.
            </div>
          </section>

          <button className="btn btn-primary w-full">Enviar chamado</button>
        </form>
      </div>
    </>
  );
}
