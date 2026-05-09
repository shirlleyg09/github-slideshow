import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "ADMIN" | "TECHNICIAN" | "CLIENT_MANAGER" | "CLIENT_USER";
      companyId?: string | null;
    };
  }

  interface User {
    role: "ADMIN" | "TECHNICIAN" | "CLIENT_MANAGER" | "CLIENT_USER";
    companyId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "ADMIN" | "TECHNICIAN" | "CLIENT_MANAGER" | "CLIENT_USER";
    companyId?: string | null;
  }
}
