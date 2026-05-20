"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SajuResult } from "@/lib/saju";
import type { ChatTurn } from "@/lib/claude";
import type { CategoryId } from "@/lib/categories";

interface Profile {
  birthDate: string;
  birthHour: number;
  saju: SajuResult;
  pinnedCategories: CategoryId[];
}

interface Message {
  role: "user" | "ai";
  text: string;
}

const INIT_MESSAGE: Message = {
  role: "ai",
  text: "안녕하세요! 사주를 바탕으로 궁금한 것들을 편하게 물어봐 주세요. 연애, 직업, 건강, 이직 등 무엇이든 좋아요.",
};

const SUGGESTIONS = ["요즘 연애운이 어때요?", "올해 직장운 좀 봐줘요", "이직해도 될까요?", "재물운 어때요?"];

export default function ChatPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([INIT_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("naepalja_profile");
    if (!raw) { router.replace("/setup"); return; }
    setProfile(JSON.parse(raw));
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(text: string) {
    if (!profile || !text.trim() || isTyping) return;

    const userMsg: Message = { role: "user", text: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsTyping(true);

    const history: ChatTurn[] = next
      .filter(m => m.role !== "ai" || m !== INIT_MESSAGE)
      .slice(0, -1)
      .map(m => ({ role: m.role === "user" ? "user" : "model", text: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saju: profile.saju,
          birthDate: profile.birthDate,
          history,
          message: text.trim(),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.text }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "잠시 후 다시 시도해주세요." }]);
    } finally {
      setIsTyping(false);
    }
  }

  if (!profile) return null;

  return (
    <div className="flex flex-col min-h-screen max-w-sm mx-auto">

      {/* 네비 */}
      <nav className="flex items-center justify-between px-5 py-5 shrink-0 border-b border-[var(--line)]">
        <span className="text-[11px] tracking-[0.4em] text-[var(--muted)] uppercase">내팔자야</span>
        <span className="text-[11px] text-[var(--muted)]">사주 상담</span>
      </nav>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-4" style={{ paddingBottom: 140 }}>

        {/* 추천 질문 (첫 메시지만) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-5 fade-up">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-[11px] px-3 py-[6px] border border-[var(--line)] text-[var(--fg-soft)] hover:border-[var(--fg-soft)] transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-4 fade-up ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "ai" && (
              <div className="w-6 h-6 shrink-0 mr-2 mt-1 flex items-center justify-center bg-[var(--fg)] rounded-full">
                <span className="text-[10px] text-[var(--bg)] font-serif">命</span>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 text-[13px] leading-[1.7] ${
                msg.role === "user"
                  ? "bg-[var(--fg)] text-[var(--bg)]"
                  : "bg-[var(--surface)] text-[var(--fg)]"
              }`}
              style={{ boxShadow: msg.role === "ai" ? "0 1px 3px rgba(0,0,0,0.06)" : "none" }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 mb-4 fade-up">
            <div className="w-6 h-6 shrink-0 flex items-center justify-center bg-[var(--fg)] rounded-full">
              <span className="text-[10px] text-[var(--bg)] font-serif">命</span>
            </div>
            <div className="px-4 py-3 bg-[var(--surface)]" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex gap-[5px] items-center h-[18px]">
                <span className="typing-dot" />
                <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
                <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="fixed bottom-[57px] left-0 right-0 bg-[var(--bg)] border-t border-[var(--line)] px-4 py-3 max-w-sm mx-auto w-full">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="궁금한 것을 물어보세요..."
            disabled={isTyping}
            className="flex-1 bg-[var(--surface)] px-4 py-3 text-[13px] text-[var(--fg)] placeholder:text-[var(--muted)] focus:outline-none border border-[var(--line)] focus:border-[var(--fg-soft)] transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className="px-4 py-3 bg-[var(--fg)] text-[var(--bg)] text-[12px] disabled:opacity-30 transition-opacity hover:opacity-80"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
