import dynamic from "next/dynamic";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";

const ParticleBackground = dynamic(
  () => import("@/components/animation/ParticleBackground"),
  { ssr: false }
);

const DEMO_POEM = {
  title: "Midnight Rain",
  content: `The sky weeps in silver threads,
Each drop a word I never said,
The night listens with patient ears,
As my heart speaks what it fears.

In the rhythm of rain I find my verse,
A blessing draped in what feels like a curse,
And somewhere between the thunder and light,
I write the poem of my endless night.`,
  author: "A quiet poet",
  language: "English",
};

const FEATURES = [
  {
    icon: "🎙️",
    title: "Speak Your Poetry",
    description:
      "Record your voice and watch your words appear instantly. No typing needed — let your natural rhythm flow.",
  },
  {
    icon: "🌍",
    title: "Any Language",
    description:
      "Write in Hindi, Arabic, Spanish, Japanese, or any of 50+ languages. Your mother tongue deserves a stage.",
  },
  {
    icon: "🔗",
    title: "Share Anywhere",
    description:
      "Every poem gets a beautiful shareable link. Send it to friends, post it on social media, or keep it private.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-midnight">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gold/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-royal-purple/5 rounded-full blur-3xl" />
        </div>

        <ParticleBackground />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto animate-fade-in">
     

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Where Poetry
            <br />
            <span className="gold-text italic">Finds Its Voice</span>
          </h1>

          <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Speak your poems into existence in any language. Record, transcribe,
            and share your verses with the world — or keep them close to your heart.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button variant="gold" size="lg" className="group">
                <span>Start Writing</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted/60">Free to use · No credit card required</p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted/40 animate-float">
          <span className="text-xs">scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold gold-text mb-4">
            A sanctuary for poets
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Everything you need to capture the poems that live inside you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <GlassCard key={f.title} glow="gold" className="text-center group">
              <div className="text-4xl mb-4 group-hover:animate-float inline-block">
                {f.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-parchment mb-3">
                {f.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">{f.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Demo Poem */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs text-muted uppercase tracking-widest mb-2">An example</p>
            <h2 className="font-serif text-3xl font-bold text-parchment">
              This is what your poem looks like
            </h2>
          </div>

          <GlassCard glow="gold" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-2xl font-bold gold-text">
                  {DEMO_POEM.title}
                </h3>
                <span className="text-xs glass px-2 py-1 rounded-full text-muted">
                  {DEMO_POEM.language}
                </span>
              </div>
              <div className="poem-content text-parchment/90 mb-6">
                {DEMO_POEM.content}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-royal-purple/20">
                <span className="text-xs text-muted">— {DEMO_POEM.author}</span>
                <span className="text-xs text-muted/50">ShowYourPoetry</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-radial from-gold/10 via-transparent to-transparent blur-2xl" />
            <div className="relative glass rounded-3xl p-12 border border-gold/20">
              <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
                Your poems are{" "}
                <span className="gold-text italic">waiting</span>
              </h2>
              <p className="text-muted mb-8 max-w-lg mx-auto">
                Every poet has a voice. Let yours be heard. Start writing today
                — in any language, in any form, in any mood.
              </p>
              <Link href="/auth/signup">
                <Button variant="gold" size="lg" className="group">
                  <span>Create Your First Poem</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
