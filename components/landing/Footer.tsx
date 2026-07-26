import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="max-w-[1120px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p
          className="text-sm leading-5 text-muted"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          &copy; {new Date().getFullYear()} GemmaCode
        </p>
        <nav className="flex items-center gap-6">
          <Link
            href="/sign-in"
            className="text-sm leading-5 text-muted hover:text-ink transition-colors duration-100"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm leading-5 text-muted hover:text-ink transition-colors duration-100"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Sign up
          </Link>
          <Link
            href="#"
            className="text-sm leading-5 text-muted hover:text-ink transition-colors duration-100"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
