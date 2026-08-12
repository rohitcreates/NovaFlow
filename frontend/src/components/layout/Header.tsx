"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import InvitationButton from "@/components/invitations/InvitationButton";

export default function Header() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isProfile = pathname === "/profile";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gray-950 text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          NovaFlow
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {/* Home */}
          <Link
            href="/"
            aria-label="Home"
            className={`
              flex h-10 w-10 items-center justify-center rounded-xl
              transition-all duration-200
              ${
                isHome
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V21h14V9.5" />
              <path d="M9 21v-6h6v6" />
            </svg>
          </Link>

          {/* Invitations */}
          <InvitationButton 
          />

          {/* Profile */}
          <Link
            href="/profile"
            aria-label="Profile"
            className={`
              flex h-10 w-10 items-center justify-center rounded-xl
              transition-all duration-200
              ${
                isProfile
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }
            `}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}