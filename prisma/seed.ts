import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();
async function main() {
  const passwordHash = await hash("Pulsari@123", 12);
  const [plan1, plan2, plan3] = await Promise.all([
    prisma.supportPlan.upsert({ where: { name: "Plano 1" }, update: {}, create: { name: "Plano 1", description: "20h mensais para suporte recorrente.", monthlyHours: 20, monthlyPrice: 390, extraHourPrice: 35 } }),
    prisma.supportPlan.upsert({ where: { name: "Plano 2" }, update: {}, create: { name: "Plano 2", description: "40h mensais para clientes com maior volume.", monthlyHours: 40, monthlyPrice: 690, extraHourPrice: 30 } }),
    prisma.supportPlan.upsert({ where: { name: "Plano 3" }, update: {}, create: { name: "Plano 3", description: "60h mensais para operações críticas.", monthlyHours: 60, monthlyPrice: 990, extraHourPrice: 28 } })
  ]);
  const company = await prisma.company.upsert({ where: { email: "contato@npassessoria.com.br" }, update: {}, create: { name: "NP Assessoria", tradeName: "NP Assessoria", email: "contato@npassessoria.com.br", phone: "+55 11 99999-9999", responsibleName: "Cliente Exemplo", notes: "Cliente exemplo para validação do MVP." } });
  const admin = await prisma.user.upsert({ where: { email: "admin@pulsari.com.br" }, update: { passwordHash }, create: { name: "Admin Pulsari", email: "admin@pulsari.com.br", passwordHash, role: "ADMIN" } });
  const tech = await prisma.user.upsert({ where: { email: "tecnico@pulsari.com.br" }, update: { passwordHash }, create: { name: "Técnico Pulsari", email: "tecnico@pulsari.com.br", passwordHash, role: "TECHNICIAN" } });
  const client = await prisma.user.upsert({ where: { email: "cliente@empresa.com.br" }, update: { passwordHash, companyId: company.id }, create: { name: "Cliente Exemplo", email: "cliente@empresa.com.br", passwordHash, role: "CLIENT_MANAGER", companyId: company.id } });
  const dashboard = await prisma.clientSystem.create({ data: { companyId: company.id, name: "Dashboard Estratégico Corporativo", type: "DASHBOARD", productionUrl: "https://dashboard.exemplo.com", description: "Dashboard financeiro e operacional.", responsibleUserId: tech.id } }).catch(async()=> prisma.clientSystem.findFirstOrThrow({where:{companyId:company.id,name:"Dashboard Estratégico Corporativo"}} as any));
  const landing = await prisma.clientSystem.create({ data: { companyId: company.id, name: "Landing Page Institucional", type: "LANDING_PAGE", productionUrl: "https://npassessoria.com.br", description: "Página institucional de captação.", responsibleUserId: tech.id } }).catch(async()=> prisma.clientSystem.findFirstOrThrow({where:{companyId:company.id,name:"Landing Page Institucional"}} as any));
  const contract = await prisma.clientSupportContract.create({ data: { companyId: company.id, supportPlanId: plan1.id, renewalDay: 1 } }).catch(async()=> prisma.clientSupportContract.findFirstOrThrow({where:{companyId:company.id}}));
  const now = new Date();
  await prisma.supportHourBalance.upsert({ where: { companyId_month_year: { companyId: company.id, month: now.getMonth()+1, year: now.getFullYear() } }, update: {}, create: { companyId: company.id, contractId: contract.id, month: now.getMonth()+1, year: now.getFullYear(), openingMinutes: 1200, remainingMinutes: 1200 } });
  const tickets = [
    ["Erro ao acessar dashboard", "Ao tentar acessar o dashboard aparece uma tela em branco após o login.", "SYSTEM_ERROR", "CRITICAL", "IN_PROGRESS", dashboard.id],
    ["Solicitação de ajuste em relatório", "Precisamos incluir uma coluna de receita recorrente no relatório mensal.", "CHANGE_REQUEST", "HIGH", "TRIAGE", dashboard.id],
    ["Dúvida sobre indicador financeiro", "Não entendi como o indicador de margem está sendo calculado.", "USAGE_QUESTION", "MEDIUM", "WAITING_CLIENT", dashboard.id],
    ["Lentidão ao carregar tela inicial", "A landing page está demorando para carregar no celular.", "SLOWNESS", "HIGH", "NEW", landing.id]
  ] as const;
  for (let i=0;i<tickets.length;i++) {
    const [title, description, category, priority, status, systemId] = tickets[i];
    await prisma.ticket.upsert({ where: { code: `PD-${String(i+1).padStart(4,"0")}` }, update: {}, create: { code: `PD-${String(i+1).padStart(4,"0")}`, companyId: company.id, requesterId: client.id, assigneeId: i===0 ? tech.id : null, systemId, title, description, category, priority, status, impact: priority, comments: { create: [{ userId: client.id, content: "Conseguem verificar, por favor?", type: "PUBLIC" }, { userId: tech.id, content: "Verificar logs e última publicação antes de responder ao cliente.", type: "INTERNAL" }] }, histories: { create: { userId: client.id, action: "created", description: "Chamado criado pelo seed inicial" } } } as any });
  }
  await prisma.knowledgeArticle.create({ data: { title: "Como abrir um chamado eficiente", category: "Dúvidas frequentes", content: "Informe o sistema, o que aconteceu, o que esperava e anexe prints sempre que possível.", visibility: "BOTH", status: "PUBLISHED", createdById: admin.id } }).catch(()=>{});
  console.log({ admin: admin.email, technician: tech.email, client: client.email, plans: [plan1.name, plan2.name, plan3.name] });
}
main().finally(() => prisma.$disconnect());
