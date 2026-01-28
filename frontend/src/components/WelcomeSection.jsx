import { ArrowRightIcon, SparklesIcon, ZapIcon, PlayIcon, Terminal } from "lucide-react";
import { useState } from "react";
import GlassCard from "./GlassCard";

function WelcomeSection({ user, onCreateSession, onJoinSession }) {
  const [sessionId, setSessionId] = useState("");

  /* handleJoin: parse URL if pasted, otherwise use ID */
  const handleJoin = () => {
    if (!sessionId.trim()) return;

    // Basic extract logic: split by slash and take last part, or use as is
    // Works for: "http://localhost:5173/session/123" -> "123"
    // Works for: "123" -> "123"
    let idToJoin = sessionId.trim();
    if (idToJoin.includes("/session/")) {
      const parts = idToJoin.split("/session/");
      idToJoin = parts[parts.length - 1]; // take the last part
    } else if (idToJoin.includes("/")) {
      // if generic url, try last segment
      const parts = idToJoin.split("/");
      idToJoin = parts[parts.length - 1];
    }

    onJoinSession(idToJoin);
  };

  return (
    <GlassCard className="relative overflow-hidden p-8 mb-10 border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 size-96 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-xl text-primary">
              <SparklesIcon className="size-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
              Welcome, {user?.name?.split(' ')[0] || "Developer"}
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-lg">
            {user?.role === "interviewer"
              ? "Ready to conduct a technical interview? Start a new session below."
              : "Sharpen your skills. Join a session to practice live coding."}
          </p>
        </div>

        <div className="w-full md:w-auto shrink-0 z-10">
          {user?.role === "interviewer" ? (
            <button
              onClick={onCreateSession}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group z-20 relative cursor-pointer"
            >
              <ZapIcon className="size-5 fill-white/20 group-hover:fill-white/40 transition-colors" />
              Create New Session
            </button>
          ) : (
            <div className="flex gap-3 w-full md:w-auto p-1.5 bg-black/30 rounded-2xl border border-white/10 backdrop-blur-md">
              <input
                type="text"
                placeholder="Enter Session ID..."
                className="flex-1 min-w-[200px] bg-transparent border-none text-white placeholder-gray-500 focus:outline-none focus:ring-0 px-4 font-mono text-sm"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
              />
              <button
                onClick={handleJoin}
                disabled={!sessionId.trim()}
                className="btn btn-primary rounded-xl px-6 min-h-[44px] h-[44px]"
              >
                <PlayIcon className="size-4" />
                Join
              </button>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default WelcomeSection;
