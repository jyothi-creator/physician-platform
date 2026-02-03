"use client";

import Image from "next/image";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import LayoutShell from "@/components/LayoutShell";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/toc");
    } catch {
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-zinc-900">
      {/* =========================
          TOP HERO STRIP (FULL BLEED)
         ========================= */}
      <section className="relative h-[185px] md:h-[200px] w-full overflow-hidden">
        <Image
          src="/hero_forestsun.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "center 25%" }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r
            from-[#fffdf8]/45
            via-[#f2efe7]/30
            to-[#fffaf2]/40"
        />
      </section>

      {/* =========================
          MAIN CONTENT (USES LAYOUT SHELL)
         ========================= */}
      <LayoutShell>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* ---------- LEFT: Editorial ---------- */}
          <div className="max-w-lg">
            <h1 className="text-xl font-semibold leading-tight mb-3">
              A Place to Practice Medicine with Clarity
            </h1>

            <p className="text-base mb-2">
              A private knowledge platform for women physicians.
            </p>

            <p className="text-sm text-zinc-700 leading-relaxed">
              Designed to support professional fulfillment and long-term practice
              through shared insight and systems-level accountability, without the
              personal toll.
            </p>
          </div>

          {/* ---------- RIGHT: Login ---------- */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white/85 backdrop-blur-sm p-7 rounded-xl shadow-sm">
              <h2 className="text-base font-semibold tracking-tight mb-4">
                Private Access
              </h2>

              <input
                type="email"
                placeholder="Email"
                className="w-full mb-3 p-3 border border-zinc-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-[#2f3a44]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full mb-5 p-3 border border-zinc-300 rounded-md
                           focus:outline-none focus:ring-2 focus:ring-[#2f3a44]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={handleLogin}
                className="w-full py-3 bg-[#2f3a44] hover:bg-[#1f2933]
                           text-white rounded-md transition"
              >
                Sign in
              </button>

              <p className="text-xs text-zinc-600 mt-3">
                Access is limited to physicians and invited contributors.
              </p>
            </div>
          </div>
        </div>
      </LayoutShell>
    </main>
  );
}
