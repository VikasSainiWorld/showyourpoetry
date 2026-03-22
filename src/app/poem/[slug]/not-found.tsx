import Link from "next/link";

export default function PoemNotFound() {
  return (
    <div className="min-h-screen bg-midnight flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-6">✦</div>
        <h1 className="font-serif text-4xl font-bold text-parchment mb-3">
          Poem not found
        </h1>
        <p className="text-muted mb-8 max-w-sm mx-auto">
          This poem may be private or the link may have changed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-midnight font-semibold px-6 py-3 rounded-lg transition-all text-sm"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
