"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/workspaces");
    } else {
      router.push("/login");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-128px)] items-center justify-center px-6">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
          Project Management, Simplified
        </p>

        <h1 className="text-5xl font-semibold tracking-tight text-gray-950 sm:text-6xl">
          Welcome to NovaFlow.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
          A focused workspace for managing projects, tasks,
          documentation, and collaboration without the clutter.
        </p>

        <div className="mt-10 flex flex-col items-center">
          <button
            type="button"
            onClick={handleStart}
            aria-label="Get started"
            className="
              group flex h-16 w-16 items-center justify-center
              rounded-full bg-gray-950 text-white
              shadow-lg shadow-black/10
              transition-all duration-300
              hover:-translate-y-1
              hover:scale-110
              hover:bg-gray-800
              hover:shadow-xl
              active:scale-95
            "
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="
                transition-transform duration-300
                group-hover:translate-x-1
              "
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>

          <p className="mt-4 text-sm text-gray-400">
            Get started
          </p>
        </div>
      </section>
    </main>
  );
}