import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppHeader } from "@/components/binder/AppHeader";
import { BottomNav } from "@/components/binder/BottomNav";
import { OfflineBar } from "@/components/binder/OfflineBar";
import { useApp } from "@/lib/context/AppContext";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { user } = useApp();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav({ to: "/login" });
  }, [user, nav]);

  if (!user) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-[#F8FAFC]">
      <OfflineBar />
      <AppHeader />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-6 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
