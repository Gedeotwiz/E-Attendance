import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <Header />

      <main className="ml-[220px] pt-[72px]">

        <div className="p-8">

          {children}

        </div>

      </main>

    </div>
  );
}