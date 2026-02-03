"use client";

import Image from "next/image";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

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
    <div className="space-y-20">
      {/* ===== HERO / MISSION ===== */}
      <section className="space-y-8">
        <h1 className="text-4xl font-semibold leading-tight max-w-3xl">
          From Burnout to Balance
        </h1>

        <p className="text-xl text-zinc-700 max-w-3xl">
          A private, physician-only knowledge platform supporting the sustained
          well-being, professional fulfillment, and retention of women
          physicians—through clarity, agency, and systems-level accountability.
        </p>

        <div className="relative w-full h-[320px] rounded-xl overflow-hidden">
          <Image
            src="/images/hero-window.jpg"
            alt="Quiet natural light through a window"
            fill
            className="object-cover"
            priority
          />
        </div>

        <p className="text-zinc-600 max-w-3xl">
          Burnout among women physicians is not an individual failing. It is a
          predictable outcome of structural, cultural, and institutional
          conditions within medicine. This platform exists to examine those
          realities clearly—and to support meaningful change at individual,
          leadership, and institutional levels.
        </p>
      </section>

      {/* ===== LOGIN / ACCESS ===== */}
      <section className="max-w-md border border-zinc-200 rounded-xl p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-6">Private Access</h2>

        <div className="space-y-4">
          <input
            className="w-full border border-zinc-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border border-zinc-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-zinc-900 text-white py-3 rounded-md hover:bg-zinc-800 transition"
          >
            Sign in
          </button>
        </div>

        <p className="text-sm text-zinc-500 mt-6">
          Access is limited to physicians and invited contributors.
        </p>
      </section>
    </div>
  );
}
