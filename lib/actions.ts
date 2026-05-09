"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  assertAdmin,
  assertTeamUser,
  canAccessCompany,
  requireUser,
  type SessionUser,
} from "@/lib/permissions";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const createCompanySchema = z.object({
  name: z.string().min(2),
  tradeName: z.preprocess(emptyToUndefined, z.string().optional()),
  email: z.string().email(),
  phone: z.preprocess(emptyToUndefined, z.string().optional()),
  responsibleName: z.string().min(2),
  notes: z.preprocess(emptyToUndefined, z.string().optional()),
});

const createSystemSchema = z.object({
  companyId: z.string().min(1),
  name: z.string().min(2),
  type: z.string().min(1),
  productionUrl: z.preprocess(emptyToUndefined, z.string().url().optional()),
  description: z.preprocess(emptyToUndefined, z.string().optional()),
});

const createTicketSchema = z.object({
  companyId: z.string().min(1),
  systemId: z.preprocess(emptyToUndefined, z.string().optional()),
  title: z.string().min(3),
  description: z.string().min(8),
  category: z.string().min(1),
  impact: z.string().min(1),
  priority: z.preprocess(emptyToUndefined, z.string().default("MEDIUM")),
  attemptedAction: z.preprocess(emptyToUndefined, z.string().optional()),
  actualResult: z.preprocess(emptyToUndefined, z.string().optional()),
  expectedResult: z.preprocess(emptyToUndefined, z.string().optional()),
  occursSince: z.preprocess(emptyToUndefined, z.string().optional()),
  affectedUsers: z.preprocess(emptyToUndefined, z.string().optional()),
});

const commentSchema = z.object({
  ticketId: z.string().min(1),
  content: z.string().min(2),
  type: z.enum(["PUBLIC", "INTERNAL"]).default("PUBLIC"),
});

const updateTicketMetaSchema = z.object({
  ticketId: z.string().min(1),
  status: z.string().min(1),
  priority: z.string().min(1),
});

const registerHoursSchema = z.object({
  ticketId: z.string().min(1),
  companyId: z.string().min(1),
  durationMinutes: z.coerce.number().int().min(1),
  activityType: z.string().min(1),
  billingType: z.string().min(1),
  description: z.string().min(3),
});

function assertCompanyAccess(user: SessionUser, companyId: string) {
  if (!canAccessCompany(user, companyId)) {
    throw new Error("Você não tem permissão para acessar dados desta empresa.");
  }
}

async function assertTicketAccess(user: SessionUser, ticketId: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, companyId: true },
  });

  if (!ticket) {
    throw new Error("Chamado não encontrado.");
  }

  assertCompanyAccess(user, ticket.companyId);
  return ticket;
}

async function nextTicketCode() {
  const count = await prisma.ticket.count();
  return `PD-${String(count + 1).padStart(4, "0")}`;
}

export async function createCompany(formData: FormData) {
  const user = await requireUser();
  assertAdmin(user);

  const data = createCompanySchema.parse(Object.fromEntries(formData));

  await prisma.company.create({
    data: {
      ...data,
      status: "ACTIVE",
    },
  });

  revalidatePath("/clients");
}

export async function createSystem(formData: FormData) {
  const user = await requireUser();
  assertTeamUser(user);

  const data = createSystemSchema.parse(Object.fromEntries(formData));
  assertCompanyAccess(user, data.companyId);

  await prisma.clientSystem.create({
    data: {
      ...data,
      type: data.type as never,
    },
  });

  revalidatePath("/systems");
}

export async function createTicket(formData: FormData) {
  const user = await requireUser();
  const data = createTicketSchema.parse(Object.fromEntries(formData));
  assertCompanyAccess(user, data.companyId);

  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
    select: { status: true },
  });

  if (!company || company.status !== "ACTIVE") {
    throw new Error("Cliente inativo, suspenso ou inexistente não pode abrir novo chamado.");
  }

  if (data.systemId) {
    const system = await prisma.clientSystem.findFirst({
      where: { id: data.systemId, companyId: data.companyId },
      select: { id: true },
    });

    if (!system) {
      throw new Error("Sistema não pertence ao cliente informado.");
    }
  }

  const ticket = await prisma.ticket.create({
    data: {
      ...data,
      systemId: data.systemId ?? null,
      requesterId: user.id,
      code: await nextTicketCode(),
      category: data.category as never,
      impact: data.impact as never,
      priority: data.priority as never,
      histories: {
        create: {
          userId: user.id,
          action: "created",
          description: "Chamado criado pelo portal",
        },
      },
    },
    select: { id: true },
  });

  revalidatePath("/tickets");
  revalidatePath("/client/tickets");
  revalidatePath(`/tickets/${ticket.id}`);
}

export async function addTicketComment(formData: FormData) {
  const user = await requireUser();
  const data = commentSchema.parse(Object.fromEntries(formData));

  await assertTicketAccess(user, data.ticketId);

  if (data.type === "INTERNAL") {
    assertTeamUser(user);
  }

  await prisma.ticketComment.create({
    data: {
      ticketId: data.ticketId,
      userId: user.id,
      content: data.content,
      type: data.type,
    },
  });

  await prisma.ticketHistory.create({
    data: {
      ticketId: data.ticketId,
      userId: user.id,
      action: "comment",
      description: data.type === "INTERNAL" ? "Comentário interno adicionado" : "Comentário público adicionado",
    },
  });

  revalidatePath(`/tickets/${data.ticketId}`);
  revalidatePath(`/client/tickets/${data.ticketId}`);
}

export async function updateTicketMeta(formData: FormData) {
  const user = await requireUser();
  assertTeamUser(user);

  const data = updateTicketMetaSchema.parse(Object.fromEntries(formData));
  await assertTicketAccess(user, data.ticketId);

  await prisma.ticket.update({
    where: { id: data.ticketId },
    data: {
      status: data.status as never,
      priority: data.priority as never,
      resolvedAt: data.status === "RESOLVED" ? new Date() : undefined,
    },
  });

  await prisma.ticketHistory.create({
    data: {
      ticketId: data.ticketId,
      userId: user.id,
      action: "updated",
      description: `Status/prioridade atualizados para ${data.status}/${data.priority}`,
    },
  });

  revalidatePath(`/tickets/${data.ticketId}`);
  revalidatePath("/tickets");
  revalidatePath("/kanban");
}

export async function registerHours(formData: FormData) {
  const user = await requireUser();
  assertTeamUser(user);

  const data = registerHoursSchema.parse(Object.fromEntries(formData));
  const ticket = await assertTicketAccess(user, data.ticketId);

  if (ticket.companyId !== data.companyId) {
    throw new Error("Empresa informada não corresponde ao chamado.");
  }

  const now = new Date();
  const contract = await prisma.clientSupportContract.findFirst({
    where: { companyId: data.companyId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (!contract) {
    throw new Error("Contrato ativo não encontrado para o cliente.");
  }

  const balance = await prisma.supportHourBalance.findFirst({
    where: {
      companyId: data.companyId,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    },
  });

  if (!balance) {
    throw new Error("Saldo mensal não encontrado.");
  }

  const isDeductible = data.billingType === "DEDUCTIBLE";

  if (isDeductible && balance.remainingMinutes < data.durationMinutes) {
    throw new Error("Saldo insuficiente. Registre como hora extra ou solicite autorização do administrador.");
  }

  const nextRemaining = isDeductible
    ? balance.remainingMinutes - data.durationMinutes
    : balance.remainingMinutes;

  await prisma.$transaction([
    prisma.supportHourBalance.update({
      where: { id: balance.id },
      data: {
        usedMinutes: { increment: isDeductible ? data.durationMinutes : 0 },
        remainingMinutes: nextRemaining,
        extraMinutes: { increment: data.billingType === "EXTRA" ? data.durationMinutes : 0 },
        courtesyMinutes: { increment: data.billingType === "COURTESY" ? data.durationMinutes : 0 },
        nonBillableMinutes: { increment: data.billingType === "NON_DEDUCTIBLE" ? data.durationMinutes : 0 },
      },
    }),
    prisma.ticket.update({
      where: { id: data.ticketId },
      data: { totalMinutes: { increment: data.durationMinutes } },
    }),
    prisma.supportHourEntry.create({
      data: {
        ticketId: data.ticketId,
        companyId: data.companyId,
        contractId: contract.id,
        userId: user.id,
        date: now,
        durationMinutes: data.durationMinutes,
        activityType: data.activityType as never,
        billingType: data.billingType as never,
        description: data.description,
        balanceAfterMinutes: nextRemaining,
      },
    }),
    prisma.ticketHistory.create({
      data: {
        ticketId: data.ticketId,
        userId: user.id,
        action: "hours",
        description: `${data.durationMinutes} minutos registrados no banco de horas`,
      },
    }),
  ]);

  revalidatePath(`/tickets/${data.ticketId}`);
  revalidatePath("/hours");
}
