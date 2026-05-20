"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

const SHOW_PREFIXES = ["/", "/period", "/talisman", "/chat", "/mypage"];

export default function ConditionalBottomNav() {
  const path = usePathname();
  const show = SHOW_PREFIXES.some((p) => p === "/" ? path === "/" : path.startsWith(p));
  if (!show) return null;
  return <BottomNav />;
}
