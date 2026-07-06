import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/context/AppContext";
import { MOCK_CONVERSATIONS } from "@/lib/mock/data";

export const Route = createFileRoute("/app/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  const { t } = useApp();
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-xl font-bold">{t("messages")}</h1>
      </header>
      <ul className="space-y-2">
        {MOCK_CONVERSATIONS.map((c) => (
          <li key={c.id}>
            <Link
              to="/app/chat/$id"
              params={{ id: c.otherId }}
              className="card-surface flex items-center gap-3 p-3"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
              >
                {c.otherName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-semibold">{c.otherName}</div>
                  <div className="shrink-0 text-[10px] text-[#64748B]">
                    {timeAgo(c.lastAt)}
                  </div>
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <div className="truncate text-xs text-[#64748B]">
                    {c.lastMessage}
                  </div>
                  {c.unread > 0 && (
                    <span
                      className="ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: "#1E40AF" }}
                    >
                      {c.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}
