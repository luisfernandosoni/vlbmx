import { Suspense } from "react";
import Player from "../../components/video/Player";
import SignInButton from "../../components/auth/SignInButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      {/* Header / Navigation */}
      <header className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          <span className="font-bold text-xl tracking-tight">VLBMX</span>
        </div>
        
        <SignInButton />
      </header>

      {/* Hero Section with Cinematic Player */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">
        
        {/* Decorative Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] -z-10" />

        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
            The Ultimate Livestream Experience
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Experience high-fidelity streams with our custom proxy engine. 
            Sign in to join the conversation and sync your watches.
          </p>
        </div>

        {/* Video Player Container */}
        <div className="w-full max-w-5xl mx-auto rounded-3xl p-2 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black">
          <Suspense fallback={<div className="w-full aspect-video bg-zinc-900 animate-pulse rounded-2xl" />}>
            <Player 
              src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8"
              title="Sprite Fight (HLS Test Stream)"
              poster="https://files.vidstack.io/sprite-fight/poster.webp"
            />
          </Suspense>
        </div>

      </section>
    </main>
  );
}
