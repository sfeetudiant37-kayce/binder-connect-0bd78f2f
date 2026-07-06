import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send, Star, X } from "lucide-react";
import { useMemo, useState } from "react";
import { RatingStars } from "@/components/binder/RatingStars";
import { useApp } from "@/lib/context/AppContext";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_PROVIDERS } from "@/lib/mock/data";
import type { Message } from "@/lib/types";

export const Route = createFileRoute("/app/chat/$id")({
  component: ChatPage,
});

function ChatPage() {
  const { id } = Route.useParams();
  const { t } = useApp();

  const conv = MOCK_CONVERSATIONS.find((c) => c.otherId === id);
  const other =
    conv ??
    MOCK_PROVIDERS.find((p) => p.userId === id) ?? {
      otherName: "Client",
      otherId: id,
      id: "cv_new",
    };
  const convId = "id" in conv! ? conv!.id : "cv_new";
  const otherName = "otherName" in other ? other.otherName : (other as any).name;

  const initial = useMemo<Message[]>(() => MOCK_MESSAGES[convId] ?? [], [convId]);
  const [messages, setMessages] = useState<Message[]>(initial);
  const [text, setText] = useState("");
  const [rateOpen, setRateOpen] = useState(false);

  function send(content: string) {
    const c = content.trim();
    if (!c) return;
    const m: Message = {
      id: crypto.randomUUID(),
      conversationId: convId,
      senderId: "me",
      content: c,
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    setMessages((cur) => [...cur, m]);
    setText("");
  }

  const quick = [t("hello"), t("whenAvailable"), t("priceQ"), t("locationQ")];

  return (
    <div className="-mx-4 -my-4 flex min-h-[calc(100dvh-176px)] flex-col bg-white">
      {/* Chat header */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] px-3 py-2">
        <Link to="/app/messages" aria-label="Back" className="rounded-full p-1 text-[#1E40AF]">
          <ArrowLeft size={20} />
        </Link>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: "#DBEAFE", color: "#1E40AF" }}
        >
          {otherName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold">{otherName}</div>
          <div className="text-[10px] text-[#64748B]">Online</div>
        </div>
        <button
          onClick={() => setRateOpen(true)}
          className="btn-secondary min-h-0 px-3 py-1.5 text-xs"
        >
          <Star size={14} /> {t("rate")}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => {
          const mine = m.senderId === "me";
          return (
            <div key={m.id} className={"flex " + (mine ? "justify-end" : "justify-start")}>
              <div
                className="max-w-[75%] rounded-2xl px-3 py-2 text-sm"
                style={
                  mine
                    ? { backgroundColor: "#1E40AF", color: "#fff", borderBottomRightRadius: 4 }
                    : {
                        backgroundColor: "#fff",
                        color: "#0f172a",
                        border: "1px solid #E2E8F0",
                        borderBottomLeftRadius: 4,
                      }
                }
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick replies */}
      <div className="border-t border-[#E2E8F0] px-3 pt-2">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-[#1E40AF] px-3 py-1.5 text-xs font-semibold text-[#1E40AF]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(text);
        }}
        className="flex items-center gap-2 border-t border-[#E2E8F0] p-3"
      >
        <input
          className="input-field"
          placeholder={t("typeMessage")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          aria-label={t("send")}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: "#1E40AF" }}
        >
          <Send size={18} />
        </button>
      </form>

      {rateOpen && <RatingModal onClose={() => setRateOpen(false)} name={otherName} />}
    </div>
  );
}

function RatingModal({ onClose, name }: { onClose: () => void; name: string }) {
  const { t } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={onClose}>
      <div className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">{t("rateService")}</h2>
            <p className="text-xs text-[#64748B]">How was your experience with {name}?</p>
          </div>
          <button aria-label={t("cancel")} onClick={onClose} className="rounded-full p-1 text-[#64748B]">
            <X size={20} />
          </button>
        </div>
        <div className="my-4 flex justify-center">
          <RatingStars value={rating} onChange={setRating} size={32} />
        </div>
        <textarea
          className="input-field"
          rows={3}
          placeholder={t("reviewPlaceholder")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn-primary mt-3 w-full" onClick={onClose}>
          {t("submit")}
        </button>
      </div>
    </div>
  );
}
