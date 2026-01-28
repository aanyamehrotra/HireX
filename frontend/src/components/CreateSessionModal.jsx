import { Code2Icon, LoaderIcon, PlusIcon, SearchIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { PROBLEMS } from "../data/problems";
import { useProblems } from "../hooks/useProblems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const { data } = useProblems();
  const problems = data?.problems || Object.values(PROBLEMS);

  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const filteredProblems = problems.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    onCreateRoom({
      ...roomConfig,
      scheduledAt: isScheduled ? scheduledAt : null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open z-[9999] pointer-events-auto">
      <div className="modal-box max-w-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative z-[10000]">
        <h3 className="font-bold text-2xl mb-6 text-white font-display">Create New Session</h3>

        <div className="space-y-8">
          {/* SCHEDULING TOGGLE */}
          <div className="space-y-4">
            <div className="flex bg-black/40 p-1 rounded-lg w-fit border border-white/10">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!isScheduled ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"}`}
                onClick={() => setIsScheduled(false)}
              >
                Start Now
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${isScheduled ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-white"}`}
                onClick={() => setIsScheduled(true)}
              >
                Schedule for Later
              </button>
            </div>

            {/* DATE TIME PICKER */}
            {isScheduled && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="label p-0 mb-2">
                  <span className="label-text font-semibold text-gray-300">Scheduled Time</span>
                </label>
                <input
                  type="datetime-local"
                  className="input input-bordered w-full bg-black/30 border-white/20 text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 text-base [color-scheme:dark]"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-xs text-gray-500 mt-2">The session will be accessible at this time.</p>
              </div>
            )}
          </div>

          {/* PROBLEM SELECTION */}
          <div className="space-y-4">
            <label className="label p-0">
              <span className="label-text font-semibold text-gray-300">Select Problem</span>
              <span className="label-text-alt text-gray-500">(Optional)</span>
            </label>

            <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden">
              {/* Search Input */}
              <div className="p-3 border-b border-white/10 flex items-center gap-2">
                <SearchIcon className="size-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-gray-600 focus:ring-0 p-0"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filtered List */}
              <div className="max-h-[200px] overflow-y-auto p-2 space-y-1">
                <button
                  onClick={() => setRoomConfig({ difficulty: "", problem: "" })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5 flex items-center justify-between ${!roomConfig.problem ? "bg-primary/10 text-primary" : "text-gray-400"}`}
                >
                  <span className="font-medium">No problem (Empty Session)</span>
                  {!roomConfig.problem && <CheckIcon className="size-4" />}
                </button>

                {filteredProblems.length === 0 ? (
                  <div className="text-center py-4 text-xs text-gray-600">No problems found</div>
                ) : (
                  filteredProblems.map((problem) => (
                    <button
                      key={problem.id}
                      onClick={() => setRoomConfig({ difficulty: problem.difficulty, problem: problem.title })}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-white/5 flex items-center justify-between group ${roomConfig.problem === problem.title ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-300"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{problem.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${problem.difficulty === "easy" ? "border-success/30 text-success" :
                          problem.difficulty === "medium" ? "border-warning/30 text-warning" :
                            "border-error/30 text-error"
                          }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      {roomConfig.problem === problem.title && <CheckIcon className="size-4" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert bg-success/10 border-success/20 text-success p-4 rounded-xl flex items-start gap-4">
              <Code2Icon className="size-6 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold mb-1">Room Summary</h4>
                <div className="text-sm opacity-90 space-y-1">
                  <p>
                    Problem: <span className="font-semibold">{roomConfig.problem}</span>
                  </p>
                  <p>
                    Max Participants: <span className="font-semibold">2 (1-on-1 session)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action mt-8 pt-6 border-t border-white/5">
          <button
            className="btn btn-ghost hover:bg-white/5 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn bg-gradient-to-r from-primary to-secondary text-white border-none gap-2 hover:shadow-lg hover:shadow-primary/20 disabled:bg-none disabled:bg-gray-800 disabled:text-gray-500"
            onClick={handleCreate}
            disabled={isCreating || (isScheduled && !scheduledAt)}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : (isScheduled ? "Schedule Session" : (roomConfig.problem ? "Create Session" : "Create Empty Session"))}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm z-[9998]" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
