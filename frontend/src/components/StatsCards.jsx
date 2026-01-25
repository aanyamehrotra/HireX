import { TrophyIcon, UsersIcon } from "lucide-react";
import GlassCard from "./GlassCard";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6 h-full">
      {/* Active Count */}
      <GlassCard className="p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <UsersIcon className="size-24 text-primary" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-xl text-primary">
              <UsersIcon className="size-6" />
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-xs font-semibold text-primary">Live</div>
          </div>

          <div className="space-y-1">
            <div className="text-4xl font-bold text-white font-display mb-1">{activeSessionsCount}</div>
            <div className="text-sm text-gray-400 font-medium">Active Sessions</div>
          </div>
        </div>
      </GlassCard>

      {/* Recent Count */}
      <GlassCard className="p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <TrophyIcon className="size-24 text-secondary" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
              <TrophyIcon className="size-6" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-bold text-white font-display mb-1">{recentSessionsCount}</div>
            <div className="text-sm text-gray-400 font-medium">Total Sessions</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

export default StatsCards;
