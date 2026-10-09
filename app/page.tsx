import CinematicNav from "@/components/cinematic/CinematicNav";
import CinematicFooter from "@/components/cinematic/CinematicFooter";
import Console from "@/components/console/Console";

export default function Home() {
  return (
    <main className="bg-[#080808] overflow-x-hidden min-h-screen">
      <CinematicNav />
      <section className="px-4 md:px-10 pt-28 md:pt-32 pb-20">
        <div className="max-w-[760px] mx-auto mb-5">
          <p
            className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            Producer · Engineer · Builder
          </p>
          <h1 className="sr-only">IN-FLU-ENTIAL LLC</h1>
        </div>
        <Console />
      </section>
      <CinematicFooter />
    </main>
  );
}
