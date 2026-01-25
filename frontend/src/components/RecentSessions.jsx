import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import GlassCard from "./GlassCard";

function RecentSessions({ sessions, isLoading }) {
  return (
    <GlassCard className="mt-8 p-6 bg-black/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-accent to-secondary rounded-lg">
          <Clock className="size-5 text-white" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">Your Past Sessions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader className="size-8 animate-spin text-primary" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <div
              key={session._id}
              className={`group relative p-5 rounded-xl border transition-all hover:-translate-y-1 ${session.status === 'active'
                  ? 'bg-success/5 border-success/30 hover:bg-success/10'
                  : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                }`}
            >
              {session.status === 'active' && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded bg-success/10 text-success text-[10px] font-bold border border-success/20">
                  <div className="size-1.5 rounded-full bg-success animate-pulse" />
                  LIVE
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${session.status === 'active' ? 'bg-success/20 text-success' : 'bg-gray-800 text-gray-400'
                  }`}>
                  <Code2 className="size-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white truncate pr-6">{session.problem}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium uppercase tracking-wider ${session.difficulty === 'hard' ? 'text-red-400' :
                        session.difficulty === 'medium' ? 'text-yellow-400' :
                          'text-green-400'
                      }`}>{session.difficulty}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="size-3" />
                  <span>{session.participant ? "2" : "1"} participants</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3" />
                  <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex p-4 rounded-full bg-white/5 mb-3">
              <Trophy className="size-6 text-gray-600" />
            </div>
            <p className="text-gray-500">No past sessions found</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default RecentSessions;
