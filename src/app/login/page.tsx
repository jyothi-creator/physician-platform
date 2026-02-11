"use client";

import Image from "next/image";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = async () => {
    setError(null);
    setMessage(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleReset = async () => {
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Please enter your email address to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email has been sent.");
    } catch {
      setError("Unable to send reset email.");
    }
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden">

      <Image
        src="/login_premium1.jpg"
        alt="Editorial abstract background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/30" />

      <div className="relative z-10 flex h-full items-center justify-end px-6 md:px-16">
        <div className="w-full max-w-md bg-white/95 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-zinc-900">

          <h2 className="text-xl font-semibold mb-8 tracking-tight">
            Private Access
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2f3a44]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-5 p-3 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2f3a44]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-[#2f3a44] hover:bg-black text-white rounded-md transition"
          >
            Sign in
          </button>

          <button
            onClick={handleReset}
            className="mt-4 text-sm text-zinc-600 hover:text-black transition"
          >
            Forgot password?
          </button>

          {/* Inline feedback */}
          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          {message && (
            <p className="mt-4 text-sm text-green-600">{message}</p>
          )}

          <p className="text-xs text-zinc-500 mt-6 leading-relaxed">
            Access is limited to physicians and invited contributors.
          </p>

        </div>
      </div>
    </main>
  );
}
