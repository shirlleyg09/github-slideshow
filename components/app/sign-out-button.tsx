"use client";
import { signOut } from "next-auth/react";
export function SignOutButton() { return <button className="btn btn-secondary" onClick={() => signOut({ callbackUrl: "/login" })}>Sair</button>; }
