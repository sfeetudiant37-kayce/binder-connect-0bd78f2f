import { createFileRoute } from "@tanstack/react-router";
import { useLiveQuery } from "dexie-react-hooks";
import { CheckCircle2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { useCallback } from "react";
import { EmptyState } from "@/components/binder/EmptyState";
import { useApp } from "@/lib/context/AppContext";
import { db } from "@/lib/db/dexie";

export const Route = createFileRoute("/app/sync")({
  component: SyncPage,
});

function SyncPage() {
  const { t, online, simulateOffline, setSimulateOffline } = useApp();

  const queue = useLiveQuery(
    () => (typeof window === "undefined" ? [] : db().queue.orderBy("createdAt").reverse().toArray()),
    [],
    [],
  );
  const swipes = useLiveQuery(
    () => (typeof window === "undefined" ? 0 : db().swipes.count()),
    [],
    0,
  );
  const matches = useLiveQuery(
    () => (typeof window === "undefined" ? 0 : db().matches.count()),
    [],
    0,
  );
  const messages = useLiveQuery(
    () => (typeof window === "undefined" ? 0 : db().messages.count()),
    [],
    0,
  );

  const syncNow = useCallback(async () => {
    if (!online) return;
    const pending = await db().queue.where("status").equals("pending").toArray();
    await Promise.all(
      pending.map((p) => db().queue.update(p.id, { status: "synced" })),
    );
    await db().swipes.toCollection().modify({ isSynced: true });
  }, [online]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold">{t("sync")}</h1>
      </header>

      <section className="card-surface p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1E3A8A]">
          {t("networkStatus")}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {online ? (
              <Wifi size={20} className="text-[#1E40AF]" />
            ) : (
              <WifiOff size={20} className="text-[#DC2626]" />
            )}
            <span className="text-sm font-bold">
              {online ? t("online") : t("offline")}
            </span>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
            <span>Simulate offline</span>
            <input
              type="checkbox"
              className="h-4 w-8 appearance-none rounded-full bg-[#E2E8F0] transition-all checked:bg-[#DC2626]"
              checked={simulateOffline}
              onChange={(e) => setSimulateOffline(e.target.checked)}
              style={{ position: "relative" }}
            />
          </label>
        </div>
        <button
          className="btn-primary mt-4 w-full"
          disabled={!online}
          onClick={syncNow}
        >
          <RefreshCw size={16} /> {t("syncNow")}
        </button>
      </section>

      <section>
        <h2 className="mb-2 text-base font-bold">{t("syncQueue")}</h2>
        {queue.length === 0 ? (
          <EmptyState title={t("noPending")} />
        ) : (
          <ul className="space-y-2">
            {queue.map((q) => (
              <li key={q.id} className="card-surface flex items-center gap-3 p-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: q.status === "synced" ? "#DBEAFE" : "#FEE2E2",
                    color: q.status === "synced" ? "#1E40AF" : "#DC2626",
                  }}
                >
                  {q.status === "synced" ? <CheckCircle2 size={16} /> : <RefreshCw size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold capitalize">{q.type}</div>
                  <div className="truncate text-[11px] text-[#64748B]">
                    {new Date(q.createdAt).toLocaleString()}
                  </div>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{
                    backgroundColor: q.status === "synced" ? "#DBEAFE" : "#FEE2E2",
                    color: q.status === "synced" ? "#1E3A8A" : "#DC2626",
                  }}
                >
                  {q.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card-surface p-4">
        <h2 className="mb-3 text-base font-bold">{t("localDbStats")}</h2>
        <div className="grid grid-cols-3 gap-2">
          <DbStat label={t("swipes")} value={swipes} />
          <DbStat label={t("matches")} value={matches} />
          <DbStat label={t("messages")} value={messages} />
        </div>
      </section>
    </div>
  );
}

function DbStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] p-3 text-center">
      <div className="text-lg font-bold text-[#1E40AF]">{value}</div>
      <div className="text-[10px] font-semibold uppercase tracking-widest text-[#64748B]">
        {label}
      </div>
    </div>
  );
}
