import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-display text-[120px] md:text-[180px] text-gold/10 font-light leading-none select-none">404</p>
      <h1 className="font-display text-4xl text-cream font-light -mt-6 mb-4">Page not found.</h1>
      <p className="font-sans text-sm text-mist mb-10 max-w-sm leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className="inline-block bg-gold text-ink px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300">
        Back to Home
      </Link>
    </section>
  );
}
