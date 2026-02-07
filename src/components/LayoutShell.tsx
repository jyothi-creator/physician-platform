"use client";

import {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

/* ======================================================
   Context to prevent duplicate shell rendering
   ====================================================== */
const LayoutShellContext = createContext<boolean>(false);

type Chapter = {
  id: string;
  title: string;
  order: number;
};

export default function LayoutShell({ children }: { children: ReactNode }) {
  const shellAlreadyMounted = useContext(LayoutShellContext);

  // 🚫 If shell already exists higher in the tree, render ONLY content
  if (shellAlreadyMounted) {
    return <>{children}</>;
  }

  const pathname = usePathname() ?? "";

  const [isAuthed, setIsAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);

  // ----------------------------
  // Auth state
  // ----------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user);
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  // ----------------------------
  // Load chapters (auth only)
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

  // Prevent hydration / auth flash
  if (!authChecked) return null;

  const showTopNav = pathname !== "/login";
  const showReadCTA = pathname === "/";
  const showSectionNav =
    isAuthed &&
    pathname !== "/login" &&
    (pathname === "/toc" ||
      pathname.startsWith("/chapter") ||
      pathname.startsWith("/subchapter"));

  const currentChapterTitle =
    chapters.find((c) => pathname.startsWith(`/chapter/${c.id}`))?.title ??
    "Table of Contents";

  return (
    <LayoutShellContext.Provider value={true}>
      <div className="min-h-screen bg-[#f7f5f2] text-zinc-900">
        {/* =======================
            GLOBAL TOP NAV
           ======================= */}
        {showTopNav && (
          <header className="w-full bg-[#0f172a] text-white">
            <div className="h-16 flex items-center justify-between px-8">
              <Link href="/" className="font-semibold tracking-wide">
                Physician Burnout KB
              </Link>

              <nav className="flex items-center gap-8 text-sm">
                <Link href="/resources" className="hover:underline">
                  Resources
                </Link>
                <Link href="/contributors" className="hover:underline">
                  Contributors
                </Link>
                <Link href="/about" className="hover:underline">
                  About
                </Link>

                {isAuthed && showReadCTA && (
                  <Link
                    href="/toc"
                    className="ml-4 rounded-full bg-white text-[#0f172a] px-5 py-2 font-semibold"
                  >
                    Read
                  </Link>
                )}
              </nav>
            </div>
          </header>
        )}

        {/* =======================
            CHAPTER DROPDOWN BAR
           ======================= */}
        {showSectionNav && (
          <div className="w-full bg-[#0f172a] text-white relative z-50">
            <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
              {/* Left */}
              <span className="text-xs uppercase tracking-widest text-white/60">
                Chapter
              </span>

              {/* Center */}
              <div className="relative">
                <button
                  onClick={() =>
                    setChapterMenuOpen((open) => !open)
                  }
                  className="flex items-center gap-2 text-lg font-semibold hover:opacity-90"
                >
                  <span>{currentChapterTitle}</span>
                  <span className="text-sm">▾</span>
                </button>

                {chapterMenuOpen && (
                  <div className="absolute left-0 mt-3 w-96 bg-white text-zinc-900 rounded-lg shadow-xl">
                    <div className="max-h-96 overflow-y-auto py-2">
                      <Link
                        href="/toc"
                        onClick={() => setChapterMenuOpen(false)}
                        className="block px-4 py-2 text-sm hover:bg-zinc-100"
                      >
                        Overview / Table of Contents
                      </Link>

                      {chapters.map((chapter) => (
                        <Link
                          key={chapter.id}
                          href={`/chapter/${chapter.id}`}
                          onClick={() => setChapterMenuOpen(false)}
                          className={`block px-4 py-2 text-sm hover:bg-zinc-100 ${
                            pathname.startsWith(
                              `/chapter/${chapter.id}`
                            )
                              ? "font-medium text-black"
                              : "text-zinc-700"
                          }`}
                        >
                          {chapter.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right spacer */}
              <div className="w-24" />
            </div>
          </div>
        )}

        {/* =======================
            PAGE CONTENT
           ======================= */}
        <main className="w-full">
          <div className="pt-10">{children}</div>
        </main>
      </div>
    </LayoutShellContext.Provider>
  );
}
