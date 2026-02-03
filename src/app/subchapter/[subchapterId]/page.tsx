"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import LayoutShell from "@/components/LayoutShell";
import Link from "next/link";

type Subchapter = {
  id: string;
  title: string;
  content?: string | string[];
  chapterId: string;
};

export default function SubchapterPage() {
  const { subchapterId } = useParams<{ subchapterId: string }>();

  const [subchapter, setSubchapter] = useState<Subchapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subchapterId) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ref = doc(db, "subchapters", subchapterId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setSubchapter(null);
          return;
        }

        setSubchapter({
          id: snap.id,
          ...(snap.data() as Omit<Subchapter, "id">),
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [subchapterId]);

  if (loading) {
    return <div className="text-zinc-500">Loading section…</div>;
  }

  if (!subchapter) {
    return <div className="text-zinc-500">Section not found.</div>;
  }

  return (
    <LayoutShell>
      {/* Header */}
      <header className="space-y-3 max-w-3xl">
        <Link
          href={`/chapter/${subchapter.chapterId}`}
          className="text-sm text-zinc-500 hover:underline"
        >
          ← Back to Chapter
        </Link>

        <h1 className="text-3xl font-semibold leading-tight text-zinc-900">
          {subchapter.title}
        </h1>
      </header>

      {/* Content */}
      <section className="mt-10 max-w-3xl space-y-6">
        {Array.isArray(subchapter.content) ? (
          subchapter.content.map((para, idx) => (
            <p
              key={idx}
              className="text-base text-zinc-800 leading-relaxed"
            >
              {para}
            </p>
          ))
        ) : subchapter.content ? (
          <p className="text-base text-zinc-800 leading-relaxed">
            {subchapter.content}
          </p>
        ) : (
          <p className="text-zinc-500">No content available.</p>
        )}
      </section>
    </LayoutShell>
  );
}
