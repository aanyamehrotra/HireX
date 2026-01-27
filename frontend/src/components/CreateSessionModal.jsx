import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
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
  const { data, isLoading } = useProblems();
  const problems = data?.problems || Object.values(PROBLEMS);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open z-[9999] pointer-events-auto">
      <div className="modal-box max-w-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl relative z-[10000]">
        <h3 className="font-bold text-2xl mb-6 text-white font-display">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label p-0 mb-2">
              <span className="label-text font-semibold text-gray-300">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <div className="relative">
              <select
                className="select select-bordered w-full bg-black/30 border-white/20 text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 text-base transition-all"
                value={roomConfig.problem}
                onChange={(e) => {
                  const selectedProblem = problems.find((p) => p.title === e.target.value);
                  setRoomConfig({
                    difficulty: selectedProblem.difficulty,
                    problem: e.target.value,
                  });
                }}
                disabled={isLoading}
              >
                <option value="" disabled className="text-gray-500">
                  {isLoading ? "Loading problems..." : "Choose a coding problem..."}
                </option>

                {problems.map((problem) => (
                  <option key={problem.id} value={problem.title} className="text-black bg-white">
                    {problem.title} ({problem.difficulty})
                  </option>
                ))}
              </select>
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
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create Session"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop bg-black/80 backdrop-blur-sm z-[9998]" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
