"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type Chapter = {
  id: string;
  title: string;
  order: number;
};

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";

  const [isAuthed, setIsAuthed] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [open, setOpen] = useState(false);

  // ----------------------------
  // Auth state
  // ----------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user);
    });
    return () => unsub();
  }, []);

  // ----------------------------
  // Load chapters (only once, only when authed)
  // ----------------------------
  useEffect(() => {
    if (!isAuthed) return;

    const load = async () => {
      const q = query(collection(db, "chapters"), orderBy("order"));
      const snap = await getDocs(q);
      setChapters(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Chapter, "id">),
        }))
      );
    };

    load();
  }, [isAuthed]);

  // ----------------------------
  // Visibility logic
  // ----------------------------
  const showChaptersNav =
    isAuthed &&
    pathname !== "/login" &&
    (pathname === "/toc" ||
      pathname.startsWith("/chapter") ||
      pathname.startsWith("/subchapter"));

  return (
    <div className="min-h-screen bg-[#f7f5f2] text-zinc-900">
      {/* =======================
          TOP NAV
         ======================= */}
      <header className="bg-white border-b border-zinc-200">
        <div className="max-w-[96rem] mx-auto px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/toc" className="font-semibold text-zinc-900">
            Physician Platform
          </Link>

          {showChaptersNav && (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="
                  flex items-center gap-2
                  px-6 py-3
                  rounded-lg
                  bg-[#2f3a44]
                  text-white
                  font-semibold
                  hover:bg-[#1f2933]
                  transition
                "
              >
                Chapters
                <span className="text-xs">▾</span>
              </button>

              {open && (
                <div
                  className="
                    absolute right-0 mt-2 w-[22rem]
                    bg-white rounded-xl
                    border border-zinc-200
                    shadow-lg
                    z-50
                  "
                >
                  <ol className="py-2 max-h-[70vh] overflow-y-auto">
                    {chapters.map((ch) => (
                      <li key={ch.id}>
                        <Link
                          href={`/chapter/${ch.id}`}
                          onClick={() => setOpen(false)}
                          className="
                            flex gap-3 px-5 py-3
                            hover:bg-zinc-50
                            transition
                          "
                        >
                          <span className="text-sm text-zinc-400 w-5">
                            {ch.order}
                          </span>
                          <span className="text-sm text-zinc-900">
                            {ch.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* =======================
          PAGE CONTENT
         ======================= */}
      <main className="max-w-[96rem] mx-auto px-4 md:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
