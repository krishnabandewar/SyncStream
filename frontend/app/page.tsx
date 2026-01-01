import CodeEditor from "@/components/CodeEditor";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0a0a0a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-white overflow-hidden">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm flex-col flex mb-12">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 pb-4 tracking-tight">
          SyncStream
        </h1>
        <p className="text-neutral-400 text-lg max-w-lg text-center mb-8">
          Real-time collaborative engineering.
          <span className="text-neutral-500 block text-xs mt-2 uppercase tracking-widest font-semibold">Distributed Systems • Low Latency</span>
        </p>

        <a href={`/room/${Math.random().toString(36).substring(7)}`}
          className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors">
          Start Coding Now
        </a>
      </div>

      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
    </main>
  );
}
