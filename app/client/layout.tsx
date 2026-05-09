import { AppSidebar } from "@/components/app/sidebar";
import { requireClientUser } from "@/lib/permissions";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  await requireClientUser();

  return (
    <div className="pulsari-shell flex min-h-screen">
      <AppSidebar area="client" />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
