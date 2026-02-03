"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import { useParams } from "next/navigation";

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

  useEffect(() => {
    if (!chapterId) return;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      // 1️⃣ Load chapters (same as TOC)
      const chapterQuery = query(
        collection(db, "chapters"),
        orderBy("order")
      );

      const chapterSnap = await getDocs(chapterQuery);
      const chapters: Chapter[] = chapterSnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Chapter, "id">),
      }));

      const found = chapters.find((c) => c.id === chapterId);

      if (!found) {
        setLoading(false);
        return;
      }

      setChapter(found);

      // 2️⃣ Load subchapters
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

      setLoading(false);
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
    <div className="space-y-20">
      <header className="space-y-6 max-w-3xl">
        <h1 className="text-4xl font-semibold leading-tight">
          {chapter.title}
        </h1>

        {chapter.overview && (
          <p className="text-lg text-zinc-700 leading-relaxed">
            {chapter.overview}
          </p>
        )}
      </header>

      <section className="space-y-8">
        <h2 className="text-2xl font-semibold">Sections</h2>

        <ol className="space-y-5">
          {subchapters.map((sub) => (
            <li key={sub.id}>
              <Link
                href={`/subchapter/${sub.id}`}
                className="group flex gap-4"
              >
                <span className="text-zinc-400 text-base font-medium">
                  {sub.order}
                </span>
                <span className="text-lg group-hover:underline underline-offset-4">
                  {sub.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
