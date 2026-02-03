import "./globals.css";

export const metadata = {
  title: "Private Physician Knowledge Platform",
  description:
    "A private, physician-only resource advancing sustainable well-being and systems-level accountability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 text-zinc-900 antialiased">
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
