import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Music" };

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-[#F5EDD8] font-light mb-4" style={{fontFamily:"Cormorant Garamond,serif"}}>Music</h1>
        <Link href="/" className="text-[#D4AF77] underline">← Back home</Link>
      </div>
    </main>
  );
}
