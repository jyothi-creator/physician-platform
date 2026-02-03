"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import Link from "next/link";

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
      if (!user) return;

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
    <div className="space-y-16">
      <header className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-semibold leading-tight">
          Table of Contents
        </h1>
        <p className="text-lg text-zinc-700">
          This resource integrates evidence, lived experience, and practical
          strategies to support women physicians across career stages and
          institutional contexts.
        </p>
      </header>

      <ol className="space-y-6">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <Link href={`/chapter/${chapter.id}`} className="group block">
              <div className="flex gap-4 items-start">
                <span className="text-zinc-400 text-lg font-medium">
                  {chapter.order}.
                </span>
                <span className="text-xl group-hover:underline underline-offset-4">
                  {chapter.title}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
