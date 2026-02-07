type Contributor = {
  name: string;
  role: string;
  affiliation?: string;
};

const contributors: Contributor[] = [
  {
    name: "Editorial Team",
    role: "Burnout in Women Physicians",
    affiliation: "2nd Edition",
  },
  {
    name: "Physician Contributors",
    role: "Clinical & Academic Perspectives",
  },
  {
    name: "Advisory Contributors",
    role: "Healthcare Leadership & Systems",
  },
];

export default function ContributorsPage() {
  return (
    <section className="max-w-7xl mx-auto px-8 pb-24">
      {/* =======================
          PAGE HEADER
         ======================= */}
      <header className="max-w-5xl mb-10">
        <h1 className="text-4xl font-semibold mb-4">
          Contributors
        </h1>
        <p className="text-lg text-zinc-700 leading-relaxed">
          This platform reflects the work of physicians, educators, and leaders
          engaged in examining burnout as a systemic issue in medicine. The
          contributions represented here inform the editorial direction and
          substance of the platform.
        </p>
      </header>

      {/* =======================
          FEATURED STATEMENT
         ======================= */}
      <section className="mb-20">
        <h2 className="text-sm uppercase tracking-widest text-zinc-500 mb-6">
          Editorial Foundation
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-6xl">
          <p className="text-zinc-700 leading-relaxed">
            The platform is developed in conjunction with the editorial team of
            <em> Burnout in Women Physicians</em> and informed by the perspectives
            of clinicians and leaders across career stages and practice
            environments. Contributions emphasize rigor, lived experience, and
            systems-level understanding.
          </p>
        </div>
      </section>

      {/* =======================
          CONTRIBUTOR GROUPS
         ======================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
        {contributors.map((c) => (
          <div key={c.name} className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-2">
              {c.name}
            </h3>
            <p className="text-zinc-600">
              {c.role}
            </p>
            {c.affiliation && (
              <p className="text-sm text-zinc-500 mt-1">
                {c.affiliation}
              </p>
            )}
          </div>
        ))}
      </section>
    </section>
  );
}
