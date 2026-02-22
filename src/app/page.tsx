import { Suspense } from "react";
import { motion } from "motion/react";
import Player from "@/components/video/Player";
import SignInButton from "@/components/auth/SignInButton";
import ChatRoom from "@/components/chat/ChatRoom";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30">
      {/* @ui-ux-pro-max: Fixed backdrop-blur glassmorphism navigation */}
      <header className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/5">
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* @ui-ux-pro-max: SVG wordmark — replaces placeholder div circles */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="1.5"/>
            <path d="M8 10l6 8 6-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-xl tracking-tight text-white">VLBMX</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <SignInButton />
        </motion.div>
      </header>

      {/* Hero Section with Cinematic Player */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">

        {/* @ui-ux-pro-max: Decorative ambient gradient orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] -z-10 pointer-events-none" />

        {/* @ui-ux-pro-max: Motion 12 staggered entrance animations on heading + subtext */}
        <motion.div
          className="text-center max-w-3xl mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
            The Ultimate Livestream Experience
          </h1>
          <motion.p
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            Experience high-fidelity streams with our custom proxy engine.
            Sign in to join the conversation and sync your watches.
          </motion.p>
        </motion.div>

        {/* Main Content Layout: Player + Chat */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* @ui-ux-pro-max: Motion 12 entrance for player container */}
          <motion.div
            className="flex-[2] rounded-3xl p-2 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black h-fit"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={<div className="w-full aspect-video bg-zinc-900 animate-pulse rounded-2xl" />}>
              <Player
                src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8"
                title="Sprite Fight (HLS Test Stream)"
                poster="https://files.vidstack.io/sprite-fight/poster.webp"
              />
            </Suspense>
          </motion.div>

          {/* Chat Room Integration */}
          <motion.div
            className="flex-1 w-full lg:min-w-[400px]"
            initial={{ opacity: 0, x: 32, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <ChatRoom roomId="vlbmx-main" />
          </motion.div>

        </div>

      </section>
    </main>
  );
}
