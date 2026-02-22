"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Chrome, Facebook, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SignInButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<"google" | "facebook" | null>(null);

  const handleSignIn = async (provider: "google" | "facebook") => {
    setIsLoading(provider);
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/", // Redirect after sign in
      });
    } catch (error) {
      console.error("Sign-in failed", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2 bg-white text-zinc-900 font-semibold rounded-full shadow-lg shadow-white/10 hover:shadow-white/20 transition-all border border-zinc-200/20"
      >
        Sign In
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden"
            >
              {/* Decorative glare */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              
              <div className="text-center z-10">
                <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
                <p className="text-zinc-400 text-sm">Sign in to sync your streams and chat.</p>
              </div>

              <div className="flex flex-col gap-3 z-10">
                <button
                  onClick={() => handleSignIn("google")}
                  disabled={isLoading !== null}
                  className="relative group flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading === "google" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Chrome className="w-5 h-5" />
                  )}
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSignIn("facebook")}
                  disabled={isLoading !== null}
                  className="relative group flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/30 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  {isLoading === "facebook" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Facebook className="w-5 h-5" />
                  )}
                  Continue with Facebook
                </button>
              </div>

              <p className="text-xs text-center text-zinc-500 z-10 mt-2">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
