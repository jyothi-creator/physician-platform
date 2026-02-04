"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";
import LayoutShell from "@/components/LayoutShell";

type Chapter = {
  id: string;
  title: string;
  overview?: string;
  order: number;
};

type Subchapter = {
  id: string;
  title: string;
  order: number;
};

export default function ChapterPage() {
  const { chapterId } = useParams<{ chapterId: string }>();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [subchapters, setSubchapters] = useState<Subchapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [sectionsOpen, setSectionsOpen] = useState(false);

  useEffect(() => {
    if (!chapterId) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Load chapter
        const chapterRef = doc(db, "chapters", chapterId);
        const chapterSnap = await getDoc(chapterRef);

        if (!chapterSnap.exists()) {
          setChapter(null);
          return;
        }

        setChapter({
          id: chapterSnap.id,
          ...(chapterSnap.data() as Omit<Chapter, "id">),
        });

        // Load subchapters
        const subQuery = query(
          collection(db, "subchapters"),
          where("chapterId", "==", chapterId),
          orderBy("order")
        );

        const subSnap = await getDocs(subQuery);
        setSubchapters(
          subSnap.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Subchapter, "id">),
          }))
        );
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [chapterId]);

  if (loading) {
    return <div className="text-zinc-500">Loading chapter…</div>;
  }

  if (!chapter) {
    return <div className="text-zinc-500">Chapter not found.</div>;
  }

  return (
    <LayoutShell>
      {/* =====================
          CHAPTER HEADER
         ===================== */}
      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold leading-tight text-zinc-900">
          {chapter.title}
        </h1>

        {chapter.overview && (
          <p className="text-lg text-zinc-700 leading-relaxed">
            {chapter.overview}
          </p>
        )}
      </header>

      {/* =====================
          SECTIONS CONTROL
         ===================== */}
      {/* =====================
    SECTIONS CONTROL
   ===================== */}
<div className="mt-10 mb-6 relative">
  <button
    onClick={() => setSectionsOpen((v) => !v)}
    className="
      inline-flex items-center gap-3
      text-2xl font-semibold text-zinc-900
      px-4 py-2
      rounded-lg
      bg-white
      border border-zinc-300
      shadow-sm
      hover:bg-zinc-50
      transition
    "
  >
    Sections
    <span
      className={`text-base transition-transform ${
        sectionsOpen ? "rotate-180" : ""
      }`}
    >
      ▾
    </span>
  </button>

  {/* DROPDOWN */}
  {sectionsOpen && subchapters.length > 0 && (
    <div
      className="
        absolute left-0 mt-2 w-[28rem]
        bg-white
        border border-zinc-200
        rounded-lg
        shadow-lg
        z-20
      "
    >
      <ol className="py-2">
        {subchapters.map((sub) => (
          <li key={sub.id}>
            <Link
              href={`/subchapter/${sub.id}`}
              onClick={() => setSectionsOpen(false)}
              className="
                flex gap-4 px-4 py-2
                text-sm text-zinc-700
                hover:bg-zinc-50
                hover:text-zinc-900
              "
            >
              <span className="text-zinc-400 w-5">
                {sub.order}
              </span>
              <span>{sub.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )}
</div>


      {/* =====================
          SECTIONS LIST
         ===================== */}
      {subchapters.length === 0 ? (
        <div className="rounded-lg bg-white border border-zinc-200 p-6 max-w-3xl">
          <p className="text-sm text-zinc-600 leading-relaxed">
            Sections for this chapter are in development and will appear here as
            they are released.
          </p>
        </div>
      ) : (
        <ol className="space-y-4">
          {subchapters.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/subchapter/${sub.id}`}
                className="
                  flex items-center gap-4
                  rounded-lg bg-white
                  px-5 py-4
                  border border-zinc-200
                  hover:border-zinc-300
                  hover:shadow-sm
                  transition
                "
              >
                <span className="text-sm font-medium text-zinc-400 w-6">
                  {sub.order}
                </span>
                <span className="text-base font-medium text-zinc-900">
                  {sub.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </LayoutShell>
  );
}
