import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Plus } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/context/AppContext";
import { MOCK_REQUESTS, formatFCFA } from "@/lib/mock/data";
import type { ServiceRequest, Urgency } from "@/lib/types";
import { X } from "lucide-react";

export const Route = createFileRoute("/app/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const { t, user } = useApp();
  const [items, setItems] = useState<ServiceRequest[]>(() =>
    MOCK_REQUESTS.filter((r) => r.location === (user?.location ?? "Douala")),
  );
  const [open, setOpen] = useState(false);

  function add(v: { title: string; description: string; budget: number; urgency: Urgency }) {
    const req: ServiceRequest = {
      id: crypto.randomUUID(),
      clientId: user?.id ?? "me",
      clientName: user?.name ?? "Me",
      title: v.title,
      description: v.description,
      category: "General",
      skills: user?.preferences ?? [],
      location: user?.location ?? "Douala",
      budget: v.budget,
      urgency: v.urgency,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setItems((cur) => [req, ...cur]);
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t("myRequests")}</h1>
      </header>

      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold">{r.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-[#64748B]">
                  {r.description}
                </p>
              </div>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                style={{
                  backgroundColor: r.urgency === "urgent" ? "#FEE2E2" : "#DBEAFE",
                  color: r.urgency === "urgent" ? "#DC2626" : "#1E3A8A",
                }}
              >
                {t(r.urgency === "urgent" ? "urgent" : r.urgency === "this_week" ? "thisWeek" : "flexible")}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-[#64748B]">
              <span className="inline-flex items-center gap-0.5">
                <MapPin size={11} />
                {r.location}
              </span>
              <span className="inline-flex items-center gap-0.5">
                <Clock size={11} />
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
              <span className="ml-auto text-sm font-bold text-[#1E40AF]">
                {formatFCFA(r.budget)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button
        aria-label={t("newRequest")}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
        style={{ backgroundColor: "#1E40AF" }}
      >
        <Plus size={26} />
      </button>

      {open && <NewRequestModal onClose={() => setOpen(false)} onSave={add} />}
    </div>
  );
}

function NewRequestModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (v: { title: string; description: string; budget: number; urgency: Urgency }) => void;
}) {
  const { t } = useApp();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(15000);
  const [urgency, setUrgency] = useState<Urgency>("this_week");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold">{t("newRequest")}</h2>
          <button aria-label={t("cancel")} onClick={onClose} className="rounded-full p-1 text-[#64748B]">
            <X size={20} />
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <input
            className="input-field"
            placeholder="Title (e.g. Fix bathroom sink)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input-field"
            rows={3}
            placeholder="Describe what you need"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">{t("budget")}</span>
              <input
                type="number"
                step={1000}
                className="input-field"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold">Urgency</span>
              <select
                className="input-field"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
              >
                <option value="urgent">{t("urgent")}</option>
                <option value="this_week">{t("thisWeek")}</option>
                <option value="flexible">{t("flexible")}</option>
              </select>
            </label>
          </div>
          <button
            className="btn-primary mt-2 w-full"
            disabled={!title || !description}
            onClick={() => onSave({ title, description, budget, urgency })}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
