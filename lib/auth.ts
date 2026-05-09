import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "E-mail e senha",
      credentials: { email: { label: "E-mail", type: "email" }, password: { label: "Senha", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || user.status !== "ACTIVE") return null;
        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role, companyId: user.companyId } as any;
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) { if (user) { token.role = (user as any).role; token.companyId = (user as any).companyId; } return token; },
    session({ session, token }) { if (session.user) { (session.user as any).id = token.sub; (session.user as any).role = token.role; (session.user as any).companyId = token.companyId; } return session; }
  }
};
