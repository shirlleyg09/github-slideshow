import { AppSidebar } from "@/components/app/sidebar";
import { requireTeamUser } from "@/lib/permissions";

export default async function TeamLayout({ children }: { children: React.ReactNode }) {
  await requireTeamUser();

  return (
    <div className="pulsari-shell flex min-h-screen">
      <AppSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
