"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";
import LayoutShell from "@/components/LayoutShell";

type Chapter = {
  id: string;
  title: string;
  order: number;
};

export default function TocPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(collection(db, "chapters"), orderBy("order"));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Chapter, "id">),
      }));

      setChapters(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return <div className="text-zinc-500">Loading contents…</div>;
  }

  return (
    <LayoutShell>
      {/* Header */}
      <header className="space-y-4 max-w-3xl">
        <h1 className="text-3xl font-semibold text-zinc-900">
          Table of Contents
        </h1>
        <p className="text-lg text-zinc-700">
          This resource integrates evidence, lived experience, and practical
          strategies to support women physicians across career stages and
          institutional contexts.
        </p>
      </header>

      {/* Chapters */}
      <section className="mt-10">
        <ol className="space-y-4">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link
                href={`/chapter/${chapter.id}`}
                className="
                  block rounded-lg bg-white
                  px-4 md:px-6 py-4
                  border border-zinc-200
                  hover:border-zinc-300
                  hover:shadow-sm
                  transition
                "
              >
                <div className="flex items-start gap-4">
                  <span className="text-sm font-medium text-zinc-400">
                    {chapter.order}
                  </span>
                  <h2 className="text-lg font-semibold text-zinc-900">
                    {chapter.title}
                  </h2>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </LayoutShell>
  );
}
