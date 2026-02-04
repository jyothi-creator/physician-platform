"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
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
  order?: number;
  status?: "draft" | "published";
};

export default function SubchapterPage() {
  const { subchapterId } = useParams<{ subchapterId: string }>();

  const [subchapter, setSubchapter] = useState<Subchapter | null>(null);
  const [prevSub, setPrevSub] = useState<Subchapter | null>(null);
  const [nextSub, setNextSub] = useState<Subchapter | null>(null);
  const [loading, setLoading] = useState(true);

  // ✏️ Editor state
  const [isEditor, setIsEditor] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState("");

  // ✅ Scroll to top on subchapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [subchapterId]);

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
        // 🔐 Check editor access
        const editorRef = doc(db, "editors", user.uid);
        const editorSnap = await getDoc(editorRef);
        setIsEditor(editorSnap.exists());

        // 1️⃣ Load current subchapter
        const ref = doc(db, "subchapters", subchapterId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setSubchapter(null);
          return;
        }

        const current = {
          id: snap.id,
          ...(snap.data() as Omit<Subchapter, "id">),
        };

        setSubchapter(current);

        // Initialize editable content
        setDraftContent(
          Array.isArray(current.content)
            ? current.content.join("\n\n")
            : current.content ?? ""
        );

        // 2️⃣ Load sibling subchapters
        const q = query(
          collection(db, "subchapters"),
          where("chapterId", "==", current.chapterId),
          orderBy("order")
        );

        const siblingsSnap = await getDocs(q);
        const siblings = siblingsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Subchapter, "id">),
        }));

        const index = siblings.findIndex((s) => s.id === current.id);
        setPrevSub(index > 0 ? siblings[index - 1] : null);
        setNextSub(index < siblings.length - 1 ? siblings[index + 1] : null);
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
      {/* =====================
          HEADER
         ===================== */}
      <header className="max-w-4xl space-y-4">
        <Link
          href={`/chapter/${subchapter.chapterId}`}
          className="text-sm text-zinc-500 hover:underline"
        >
          ← Back to Chapter
        </Link>

        <h1 className="text-4xl font-semibold leading-tight text-zinc-900">
          {subchapter.title}
        </h1>

        {subchapter.status === "draft" && (
          <span className="inline-block text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
            Draft / In progress
          </span>
        )}

        {isEditor && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-zinc-600 hover:text-zinc-900 underline"
          >
            Edit this section
          </button>
        )}
      </header>

      {/* =====================
          CONTENT
         ===================== */}
      <section className="mt-6 max-w-4xl">
        <div className="bg-white rounded-xl border border-zinc-200 px-6 py-6 space-y-8">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                rows={12}
                className="w-full rounded-lg border border-zinc-300 px-4 py-3 text-[15px]
                           focus:outline-none focus:ring-2 focus:ring-zinc-400"
              />

              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    const paragraphs = draftContent
                      .split("\n\n")
                      .map((p) => p.trim())
                      .filter(Boolean);

                    await updateDoc(
                      doc(db, "subchapters", subchapter.id),
                      {
                        content: paragraphs,
                        updatedAt: new Date(),
                      }
                    );

                    setSubchapter({
                      ...subchapter,
                      content: paragraphs,
                    });

                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-md bg-zinc-900 text-white text-sm"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setDraftContent(
                      Array.isArray(subchapter.content)
                        ? subchapter.content.join("\n\n")
                        : subchapter.content ?? ""
                    );
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded-md border border-zinc-300 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : Array.isArray(subchapter.content) ? (
            subchapter.content.map((para, idx) => (
              <p
                key={idx}
                className="text-[17px] leading-relaxed text-zinc-800"
              >
                {para}
              </p>
            ))
          ) : subchapter.content ? (
            <p className="text-[17px] leading-relaxed text-zinc-800">
              {subchapter.content}
            </p>
          ) : (
            <p className="text-sm text-zinc-500 italic">
              This section is being developed and will be published soon.
            </p>
          )}
        </div>
      </section>

      {/* =====================
          NEXT / PREVIOUS
         ===================== */}
      {(prevSub || nextSub) && (
        <nav className="mt-10 max-w-4xl flex justify-between gap-6">
          {prevSub ? (
            <Link
              href={`/subchapter/${prevSub.id}`}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-5 py-4
                         hover:border-zinc-300 hover:shadow-sm transition"
            >
              <span className="block text-xs text-zinc-500 mb-1">
                ← Previous
              </span>
              <span className="text-sm font-medium text-zinc-900">
                {prevSub.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextSub && (
            <Link
              href={`/subchapter/${nextSub.id}`}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-5 py-4 text-right
                         hover:border-zinc-300 hover:shadow-sm transition"
            >
              <span className="block text-xs text-zinc-500 mb-1">
                Next →
              </span>
              <span className="text-sm font-medium text-zinc-900">
                {nextSub.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </LayoutShell>
  );
}
