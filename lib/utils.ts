import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function minutesToHours(minutes = 0) {
  const h = Math.floor(minutes / 60); const m = minutes % 60;
  return `${h}h${m ? ` ${m}min` : ""}`;
}
export function currencyBRL(value: number | string) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
export function statusLabel(status: string) {
  return ({ NEW:"Novo", TRIAGE:"Em triagem", IN_PROGRESS:"Em atendimento", WAITING_CLIENT:"Aguardando cliente", WAITING_THIRD_PARTY:"Aguardando terceiro", DEVELOPMENT:"Em desenvolvimento", TESTING:"Em teste", RESOLVED:"Resolvido", CLOSED:"Encerrado", REOPENED:"Reaberto", CANCELED:"Cancelado" } as Record<string,string>)[status] ?? status;
}
export function priorityLabel(priority: string) {
  return ({ LOW:"Baixa", MEDIUM:"Média", HIGH:"Alta", CRITICAL:"Crítica" } as Record<string,string>)[priority] ?? priority;
}
