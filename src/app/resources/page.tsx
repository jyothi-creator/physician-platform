export default function ResourcesPage() {
  return (
    <section className="max-w-7xl mx-auto px-8 pb-20">
      {/* =======================
          PAGE HEADER
         ======================= */}
      <header className="max-w-3xl mb-8">
        <h1 className="text-4xl font-semibold mb-4">
          Resources
        </h1>
        <p className="text-lg text-zinc-700 leading-relaxed">
          A curated selection of materials that extend and contextualize the work
          presented in <em>Burnout in Women Physicians</em>. These resources are
          chosen for depth, relevance, and alignment with the platform’s
          editorial mission.
        </p>
      </header>

      {/* =======================
          FEATURED RESOURCE
         ======================= */}
      <section className="mb-20">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-6">
          Featured
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border p-10 max-w-4xl">
          <h3 className="text-2xl font-semibold mb-4">
            Burnout in Women Physicians — Presentation
          </h3>

          <p className="text-zinc-700 leading-relaxed mb-6">
            An in-depth presentation exploring the systemic, cultural, and
            professional dimensions of burnout in women physicians. This
            presentation is used in academic, clinical, and leadership settings
            to support discussion and reflection.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/assets/burnout-in-women-physicians-presentation-feb626.pdf"
              className="inline-flex items-center rounded-full bg-[#0f172a] text-white px-6 py-3 font-semibold hover:bg-black transition"
            >
              View Presentation
            </a>

            <span className="text-sm text-zinc-500">
              PDF · Slides
            </span>
          </div>
        </div>
      </section>

      {/* =======================
          FORTHCOMING SECTIONS
         ======================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Conversations */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-3">
            Conversations & Audio
          </h3>
          <p className="text-zinc-600 leading-relaxed">
            Recorded conversations and audio materials exploring lived
            experience, professional identity, and systems-level change will be
            added here as the platform evolves.
          </p>
        </div>

        {/* Video */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-3">
            Video & Visual Media
          </h3>
          <p className="text-zinc-600 leading-relaxed">
            Curated video content, including talks and interviews, will be
            introduced in future phases to complement the written work.
          </p>
        </div>
      </section>
    </section>
  );
}
