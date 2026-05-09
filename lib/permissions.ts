import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: "ADMIN" | "TECHNICIAN" | "CLIENT_MANAGER" | "CLIENT_USER";
  companyId?: string | null;
};

export const teamRoles = ["ADMIN", "TECHNICIAN"] as const;
export const clientRoles = ["CLIENT_MANAGER", "CLIENT_USER"] as const;

export async function requireUser() {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;

  if (!user?.id) {
    redirect("/login");
  }

  return user;
}

export async function requireTeamUser() {
  const user = await requireUser();

  if (!teamRoles.includes(user.role as (typeof teamRoles)[number])) {
    redirect("/client/dashboard");
  }

  return user;
}

export async function requireClientUser() {
  const user = await requireUser();

  if (!clientRoles.includes(user.role as (typeof clientRoles)[number]) || !user.companyId) {
    redirect("/dashboard");
  }

  return user;
}

export function assertTeamUser(user: SessionUser) {
  if (!teamRoles.includes(user.role as (typeof teamRoles)[number])) {
    throw new Error("Apenas a equipe Pulsari pode executar esta ação.");
  }
}

export function assertAdmin(user: SessionUser) {
  if (user.role !== "ADMIN") {
    throw new Error("Apenas administradores Pulsari podem executar esta ação.");
  }
}

export function canAccessCompany(user: SessionUser, companyId: string) {
  return teamRoles.includes(user.role as (typeof teamRoles)[number]) || user.companyId === companyId;
}
