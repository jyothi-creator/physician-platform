type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  return (
    <main className="min-h-screen bg-[#f7f5f2] text-zinc-900">
      <section
        className="
          max-w-[96rem]
          mx-auto
          px-2
          md:px-6
          lg:px-8
          py-4
        "
      >
        {children}
      </section>
    </main>
  );
}
