import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
  ClockIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";
import GlassCard from "./GlassCard";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <GlassCard className="lg:col-span-2 p-6 flex flex-col h-full bg-black/20">
      <GlassCard className="lg:col-span-2 p-6 flex flex-col h-full bg-black/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
              <ZapIcon className="size-5 text-white" />
            </div>
            <h2 className="text-xl font-bold font-display text-white">Live Sessions</h2>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
            <div className="size-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success">{sessions.length} active</span>
          </div>
        </div>

      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoaderIcon className="size-8 animate-spin text-primary" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="relative size-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center shrink-0">
                  <Code2Icon className="size-6 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{session.problem || "No Problem Selected (Empty)"}</h3>
                    {session.status === "scheduled" ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                        <ClockIcon className="size-3" /> Scheduled
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${session.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                        session.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          session.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                        {session.difficulty || "Any"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CrownIcon className="size-3" /> {session.host?.name}
                    </span>
                    {session.status === "scheduled" && session.scheduledAt ? (
                      <span className="text-gray-400 font-mono text-xs">
                        {new Date(session.scheduledAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <UsersIcon className="size-3" /> {session.participant ? "2/2" : "1/2"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 self-end sm:self-center">
                {session.participant && !isUserInSession(session) ? (
                  <span className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">Full</span>
                ) : (
                  <Link to={`/session/${session._id}`}>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary/80 to-secondary/80 hover:from-primary hover:to-secondary text-white text-sm font-bold shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2">
                      {isUserInSession(session) && session.status !== "scheduled" ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="size-4" />
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-white/5 mb-4">
              <Code2Icon className="size-8 text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No live sessions currently</p>
            <p className="text-gray-600 text-sm mt-1">Create a new session to get started!</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
export default ActiveSessions;
