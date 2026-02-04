"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";

type Chapter = {
  id: string;
  title: string;
  order: number;
};

export default function LayoutShell({ children }: { children: ReactNode }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(collection(db, "chapters"), orderBy("order"));
      const snap = await getDocs(q);

      setChapters(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Chapter, "id">),
        }))
      );
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-zinc-900">
      {/* ================= HEADER ================= */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-[96rem] mx-auto px-3 md:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Physician Platform
          </Link>

          {/* Navigation */}
          <nav className="relative flex items-center">
  <div className="relative">
    <button
      type="button"
      aria-label="Open chapters menu"
      onClick={() => setMenuOpen((v) => !v)}
      className="
        flex items-center gap-2
        h-10 px-6
        rounded-t-lg
        bg-[#2f3a44]
        text-white
        text-sm font-semibold
        tracking-wide
        hover:bg-[#1f2933]
        transition
      "
    >
      Chapters
      <span className="text-xs opacity-80">▾</span>
    </button>

              {/* Dropdown */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-80 rounded-xl bg-white border border-zinc-200 shadow-lg z-50">
                  <ol className="py-3">
                    {chapters.map((chapter) => (
                      <li key={chapter.id}>
                        <Link
                          href={`/chapter/${chapter.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="
                            block px-5 py-2.5
                            text-sm text-zinc-700
                            hover:bg-zinc-50 hover:text-zinc-900
                          "
                        >
                          <span className="mr-2 text-zinc-400">
                            {chapter.order}
                          </span>
                          {chapter.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-[96rem] mx-auto px-3 md:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
