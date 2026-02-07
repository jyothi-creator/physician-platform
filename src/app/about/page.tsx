export default function AboutPage() {
  return (
    <section className="max-w-7xl mx-auto px-8 pb-24">
      {/* =======================
          PAGE HEADER
         ======================= */}
      <header className="max-w-5xl mb-10">
        <h1 className="text-4xl font-semibold mb-4">
          About the Platform
        </h1>
        <p className="text-lg text-zinc-700 leading-relaxed">
          This platform extends the work of <em>Burnout in Women Physicians</em>,
          examining burnout as a systemic and cultural issue within medicine. It
          is designed to support thoughtful engagement, professional reflection,
          and informed dialogue.
        </p>
      </header>

      {/* =======================
          FEATURED PLATFORM STATEMENT
         ======================= */}
      <section className="mb-24">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-6">
          Platform Statement
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border p-12 max-w-6xl">
          <h3 className="text-2xl font-semibold mb-5">
            An Editorial Knowledge Platform
          </h3>

          <p className="text-zinc-700 leading-relaxed mb-4">
            Burnout among women physicians cannot be reduced to individual
            resilience or personal coping strategies. It reflects deeper
            structural conditions—organizational design, professional norms,
            gendered expectations, and evolving healthcare systems.
          </p>

          <p className="text-zinc-700 leading-relaxed">
            This platform provides a curated, editorial space for structured
            reading, selected resources, and contextual analysis, intended for
            physicians, educators, and healthcare leaders seeking clarity rather
            than simplification.
          </p>
        </div>
      </section>
    </section>
  );
}
