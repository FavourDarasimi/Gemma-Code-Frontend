import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { CodeIcon } from "@/lib/icons";

const links = [
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Changelog", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-[1500px] mx-auto px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          {/* Brand */}
          <div className="max-w-[320px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-7 h-7 rounded-[6px] bg-accent text-on-accent shrink-0">
                <HugeiconsIcon icon={CodeIcon} size={16} />
              </div>
              <span
                className="text-lg font-[600] leading-6 text-ink"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                GemmaCode
              </span>
            </div>
            <p
              className="text-sm leading-5 text-muted"
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              AI-powered code assistant that helps you build, fix, and understand code faster.
            </p>
          </div>

          {/* Links row */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm leading-5 text-muted hover:text-ink transition-colors duration-100"
                style={{ fontFamily: "var(--font-geist-sans)" }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-2 pl-8 border-l border-line">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted hover:text-ink transition-colors duration-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                </svg>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-muted hover:text-ink transition-colors duration-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p
            className="text-sm leading-5 text-muted order-2 md:order-1"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            &copy; {new Date().getFullYear()} GemmaCode
          </p>
          <p
            className="text-[13px] leading-5 text-muted/60 order-1 md:order-2"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            built with GemmaCode
          </p>
        </div>
      </div>
    </footer>
  );
}
