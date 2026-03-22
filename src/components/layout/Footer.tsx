import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-royal-purple/20 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">✦</span>
            <span className="font-serif text-base font-medium gold-text">
              ShowYourPoetry
            </span>
          </div>
          <p className="text-xs text-muted text-center">
            Where every voice becomes a verse.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted">
            <Link href="/" className="hover:text-parchment transition-colors">
              Home
            </Link>
            <Link href="/auth/signup" className="hover:text-parchment transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-muted/40 mt-6">
          © {new Date().getFullYear()} ShowYourPoetry. Speak your world into words.
        </p>
      </div>
    </footer>
  );
}
