"use client";

import Link from "next/link";
import Image from "next/image";


export default function HomePage() {
  return (
    <>


<section className="relative -mt-12 pt-12 min-h-[85vh] overflow-hidden bg-zinc-900">
  {/* ===== Background Image ===== */}
  <div className="absolute inset-0">
    <Image
      src="/home1.jpg"
      alt="Burnout in Women Physicians"
      fill
      priority
      className="object-cover"
    />

    {/* ONE notch only – barely perceptible */}
    <div className="absolute inset-0 bg-white/3" />
  </div>

  {/* ===== Content ===== */}
  <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
    
    {/* LEFT */}
    <div className="text-white max-w-xl">
      <h1 className="text-5xl leading-tight font-semibold">
        Burnout in<br />Women Physicians
      </h1>

      <p className="mt-6 text-lg text-white/90 leading-relaxed">
        A private, editorial knowledge platform supporting women physicians
        through systems-level insight, lived experience, and professional
        accountability.
      </p>

      <p className="mt-8 text-xs text-white/70">
        Developed in conjunction with the editorial team of{" "}
        <em>Burnout in Women Physicians</em> (2nd Edition).
      </p>
    </div>

    {/* RIGHT */}
    <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md">
      <h2 className="text-2xl font-semibold text-zinc-900">
        Read the Book
      </h2>

      <p className="mt-4 text-zinc-700 leading-relaxed">
        Explore chapters and sections examining physician burnout through
        narrative, evidence, and systemic analysis.
      </p>

      <a
        href="/toc"
        className="inline-flex items-center justify-center mt-8 rounded-full bg-[#0f172a] text-white px-6 py-3 font-semibold hover:bg-black transition"
      >
        Browse Chapters →
      </a>
    </div>
  </div>
</section>


      {/* =========================
          NAVIGATION BAND (ACP STYLE)
         ========================= */}
      <section className="w-full bg-[#111827] text-white">
        <div className="max-w-[96rem] mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <Link href="/resources" className="group">
            <h3 className="text-lg font-semibold mb-2 group-hover:underline">
              Resources
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Presentations, videos, slide decks, and reference materials.
            </p>
          </Link>

          <Link href="/contributors" className="group">
            <h3 className="text-lg font-semibold mb-2 group-hover:underline">
              Contributors
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Editors, chapter leads, and authors shaping this work.
            </p>
          </Link>

          <Link href="/about" className="group">
            <h3 className="text-lg font-semibold mb-2 group-hover:underline">
              About the Platform
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Editorial vision and systems-focused approach.
            </p>
          </Link>
        </div>
      </section>

      {/* =========================
          EDITORIAL CONTEXT BAND
         ========================= */}
      <section className="w-full bg-[#f7f5f2]">
        <div className="max-w-[72rem] mx-auto px-8 py-20">
          <h3 className="text-2xl font-semibold text-zinc-900 mb-4">
            Why this platform exists
          </h3>

          <p className="text-zinc-700 leading-relaxed max-w-3xl">
            Physician burnout is often framed as an individual failing rather
            than a systemic one. This platform centers institutional structures,
            professional culture, and lived experience.
          </p>
        </div>
      </section>
    </>
  );
}
