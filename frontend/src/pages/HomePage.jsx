import { Link } from "react-router";
import {
  ArrowRightIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
  TerminalIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import BackgroundSquares from "../components/BackgroundSquares";
import GlassCard from "../components/GlassCard";

function HomePage() {
  return (
    <div className="relative min-h-screen text-gray-200 overflow-hidden font-sans selection:bg-primary/30">
      <BackgroundSquares />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">
        <GlassCard className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between !bg-white/5 !border-white/10 rounded-full">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 group"
          >
            <div className="relative size-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative size-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-inner border border-white/10">
                <TerminalIcon className="size-5 text-white" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white font-display">
                HireX
              </span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <Link to="/dashboard">
            <button className="relative px-6 py-2.5 rounded-full font-medium text-sm text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group">
              <span>Get Started</span>
              <ArrowRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </GlassCard>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20">
        <div className="text-center space-y-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary-content/80 backdrop-blur-md"
          >
            <SparklesIcon className="size-4 text-yellow-400 fill-yellow-400/20" />
            <span>The Intelligent Interview Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black tracking-tight leading-[1.1] font-display"
          >
            Master Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400">
              Technical Interview
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto"
          >
            Experience a synchronized coding environment with real-time video,
            designed to simulate top-tier technical interviews.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
          >
            <Link to="/dashboard">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
                Start Practicing Now
              </button>
            </Link>

            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2">
              <VideoIcon className="size-5" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Mockup / Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="mt-20 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-2 shadow-2xl relative"
        >
          <div className="absolute inset-x-0 -top-20 h-40 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl -z-10" />
          <div className="rounded-xl overflow-hidden border border-white/5 bg-[#0F0F0F] relative">
            {/* Fake Titlebar */}
            <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-yellow-500/80" />
              <div className="size-3 rounded-full bg-green-500/80" />
            </div>
            {/* Fake Content area */}
            <div className="grid grid-cols-[1fr_300px] h-[400px]">
              <div className="p-6 border-r border-white/10">
                <div className="h-4 w-1/3 bg-white/10 rounded mb-6" />
                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-white/5 rounded" />
                  <div className="h-3 w-1/2 bg-white/5 rounded" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                </div>
                <div className="mt-8 p-4 rounded-lg bg-black/50 font-mono text-sm text-blue-300">
                  function twoSum(nums, target) &#123;<br />
                  &nbsp;&nbsp; const map = new Map();<br />
                  &nbsp;&nbsp; for (let i = 0; i &lt; nums.length; i++) &#123;<br />
                  <span className="animate-pulse">|</span>

                </div>
              </div>
              <div className="p-4 bg-white/5 flex flex-col gap-4">
                <div className="h-32 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <VideoIcon className="size-8 text-white/20" />
                </div>
                <div className="h-32 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center">
                  <UsersIcon className="size-8 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FEATURES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard hoverEffect className="p-8">
            <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6 text-primary">
              <VideoIcon className="size-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-display">HD Video Call</h3>
            <p className="text-gray-400 leading-relaxed">
              Low-latency video and audio communication directly integrated into your coding environment.
            </p>
          </GlassCard>

          <GlassCard hoverEffect className="p-8">
            <div className="size-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-6 text-secondary">
              <Code2Icon className="size-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-display">Collaborative Editor</h3>
            <p className="text-gray-400 leading-relaxed">
              Write code together in real-time with shared cursors, syntax highlighting, and instant execution.
            </p>
          </GlassCard>

          <GlassCard hoverEffect className="p-8">
            <div className="size-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6 text-accent">
              <ZapIcon className="size-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 font-display">Problem Library</h3>
            <p className="text-gray-400 leading-relaxed">
              Access a curated list of technical interview problems across varying difficulty levels.
            </p>
          </GlassCard>
        </div>
      </div>


      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 text-center text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <TerminalIcon className="size-5 text-gray-400" />
            <span className="text-gray-300 font-semibold">HireX</span>
          </div>
          <p>&copy; 2024 HireX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
