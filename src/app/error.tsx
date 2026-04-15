"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Something went wrong</h1>
      <p className="text-sm text-[var(--color-text-secondary)]">An unexpected error occurred. Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] transition hover:bg-[var(--color-primary-700)]"
      >
        Try again
      </button>
    </main>
  );
}
