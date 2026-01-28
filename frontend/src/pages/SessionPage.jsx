import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById, useUpdateSession } from "../hooks/useSessions";
import { useAuth } from "../context/AuthContext";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Code2Icon, CopyIcon, Loader2Icon, LogOutIcon, PencilIcon, PhoneOffIcon, RefreshCwIcon, SearchIcon, CheckIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import toast from "react-hot-toast";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { authUser } = useAuth();

  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [showChangeProblemModal, setShowChangeProblemModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();
  const updateSessionMutation = useUpdateSession();

  const session = sessionData?.session;
  const isHost = session?.host?._id === authUser?._id;
  const isParticipant = session?.participant?._id === authUser?._id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant,
    authUser // Pass real user
  );

  );

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !authUser || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, {
      onSuccess: () => {
        refetch();
        toast.success("Joined session successfully");
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to join session");
        // If session is full or completed, redirect or show error state logic could go here
        // For now, toast is sufficient feedback as the user will remain in read-only/error state
      }
    });

  });
}, [session, authUser, loadingSession, isHost, isParticipant, id]);

// redirect the "participant" when session ends
useEffect(() => {
  if (!session || loadingSession) return;

  if (session.status === "completed") navigate("/dashboard");
}, [session, loadingSession, navigate]);

useEffect(() => {
  if (problemData?.starterCode?.[selectedLanguage]) {
    setCode(problemData.starterCode[selectedLanguage]);
    setOutput(null); // Clear previous output
  }
}, [problemData?.title, selectedLanguage]); // Dependency on title ensures update on problem switch

const handleLanguageChange = (e) => {
  const newLang = e.target.value;
  setSelectedLanguage(newLang);
  const starterCode = problemData?.starterCode?.[newLang] || "";
  setCode(starterCode);
  setOutput(null);
};

const handleRunCode = async () => {
  setIsRunning(true);
  setOutput(null);

  const result = await executeCode(selectedLanguage, code);
  setOutput(result);
  setIsRunning(false);
};

const handleEndSession = () => {
  setShowEndSessionModal(true);
};

const confirmEndSession = () => {
  setShowEndSessionModal(false);
  endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
};

const handleCopySessionId = () => {
  navigator.clipboard.writeText(id);
  toast.success("Session ID copied to clipboard");
};

const handleChangeProblem = (newProblemTitle) => {
  const newProblem = Object.values(PROBLEMS).find((p) => p.title === newProblemTitle);
  if (!newProblem) return;

  updateSessionMutation.mutate(
    {
      id,
      problem: newProblem.title,
      difficulty: newProblem.difficulty.toLowerCase(),
    },
    {
      onSuccess: () => {
        setShowChangeProblemModal(false);
        refetch(); // Trigger refetch to update UI immediately
      },
    }
  );
};

return (
  <div className="h-screen bg-base-100 flex flex-col">
    <Navbar />

    <div className="flex-1">
      <PanelGroup direction="horizontal">
        <div className="flex-1">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={50} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={50} minSize={20}>
                  <div className="h-full overflow-y-auto bg-base-200">
                    <div className="p-6 bg-base-100 border-b border-base-300">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
                            {session?.problem || "No Problem Selected"}
                            {isHost && session?.status === "active" && (
                              <button
                                className="btn btn-ghost btn-xs btn-circle opacity-50 hover:opacity-100 transition-opacity"
                                onClick={() => setShowChangeProblemModal(true)}
                                title="Change Problem"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                            )}
                          </h1>
                          {!session?.problem ? (
                            <p className="text-base-content/60 mt-1">Pick a question to get started</p>
                          ) : (
                            problemData?.category && <p className="text-base-content/60 mt-1">{problemData.category}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-base-content/60 mt-2">
                            <p>
                              Host: {session?.host?.name || "Loading..."} •{" "}
                              {session?.participant ? 2 : 1}/2 participants
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-md text-xs">
                                <span className="font-mono">{id}</span>
                                <button
                                  onClick={handleCopySessionId}
                                  className="hover:text-primary transition-colors p-1"
                                  title="Copy Session ID"
                                >
                                  <CopyIcon className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}/session/${id}`;
                                  navigator.clipboard.writeText(url);
                                  toast.success("Link copied to clipboard");
                                }}
                                className="btn btn-xs btn-primary btn-outline gap-1"
                              >
                                <CopyIcon className="w-3 h-3" />
                                Share Link
                              </button>
                            </div>

                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {session?.difficulty && (
                            <span
                              className={`badge badge-lg ${getDifficultyBadgeClass(
                                session?.difficulty
                              )}`}
                            >
                              {session?.difficulty.slice(0, 1).toUpperCase() +
                                session?.difficulty.slice(1) || "Easy"}
                            </span>
                          )}
                          {isHost && session?.status === "active" && (
                            <button
                              onClick={handleEndSession}
                              disabled={endSessionMutation.isPending}
                              className="btn btn-error btn-sm gap-2"
                            >
                              {endSessionMutation.isPending ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                              ) : (
                                <LogOutIcon className="w-4 h-4" />
                              )}
                              End Session
                            </button>
                          )}
                          {session?.status === "completed" && (
                            <span className="badge badge-ghost badge-lg">Completed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {!problemData && isHost && (
                        <div className="text-center py-10 px-4 bg-base-100 rounded-xl border border-base-300 shadow-sm border-dashed">
                          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Code2Icon className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">No Question Selected</h3>
                          <p className="text-base-content/70 mb-6 max-w-sm mx-auto">
                            Start solving by selecting a coding problem from our library. You can switch questions at any time.
                          </p>
                          <button
                            onClick={() => setShowChangeProblemModal(true)}
                            className="btn btn-primary"
                          >
                            Pick a Question
                          </button>
                        </div>
                      )}

                      {!problemData && !isHost && (
                        <div className="text-center py-10 px-4">
                          <h3 className="text-lg font-semibold text-base-content/50">Waiting for host to select a problem...</h3>
                        </div>
                      )}

                      {problemData?.description && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">Description</h2>
                          <div className="space-y-3 text-base leading-relaxed">
                            <p className="text-base-content/90">{problemData.description.text}</p>
                            {problemData.description.notes?.map((note, idx) => (
                              <p key={idx} className="text-base-content/90">
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                      {problemData?.examples && problemData.examples.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

                          <div className="space-y-4">
                            {problemData.examples.map((example, idx) => (
                              <div key={idx}>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="badge badge-sm">{idx + 1}</span>
                                  <p className="font-semibold text-base-content">Example {idx + 1}</p>
                                </div>
                                <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                                  <div className="flex gap-2">
                                    <span className="text-primary font-bold min-w-[70px]">
                                      Input:
                                    </span>
                                    <span>{example.input}</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <span className="text-secondary font-bold min-w-[70px]">
                                      Output:
                                    </span>
                                    <span>{example.output}</span>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-2 border-t border-base-300 mt-2">
                                      <span className="text-base-content/60 font-sans text-xs">
                                        <span className="font-semibold">Explanation:</span>{" "}
                                        {example.explanation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {problemData?.constraints && problemData.constraints.length > 0 && (
                        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
                          <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
                          <ul className="space-y-2 text-base-content/90">
                            {problemData.constraints.map((constraint, idx) => (
                              <li key={idx} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <code className="text-sm">{constraint}</code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel defaultSize={50} minSize={20}>
                  <PanelGroup direction="vertical">
                    <Panel defaultSize={70} minSize={30}>
                      <CodeEditorPanel
                        selectedLanguage={selectedLanguage}
                        code={code}
                        isRunning={isRunning}
                        onLanguageChange={handleLanguageChange}
                        onCodeChange={(value) => setCode(value)}
                        onRunCode={handleRunCode}
                      />
                    </Panel>

                    <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                    <Panel defaultSize={30} minSize={15}>
                      <OutputPanel output={output} />
                    </Panel>
                  </PanelGroup>
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            <Panel defaultSize={50} minSize={30}>
              <div className="h-full bg-base-200 p-4 overflow-auto">
                {isInitializingCall ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                      <p className="text-lg">Connecting to video call...</p>
                    </div>
                  </div>
                ) : !streamClient || !call ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="card bg-base-100 shadow-xl max-w-md">
                      <div className="card-body items-center text-center">
                        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                          <PhoneOffIcon className="w-12 h-12 text-error" />
                        </div>
                        <h2 className="card-title text-2xl">Connection Failed</h2>
                        <p className="text-base-content/70">Unable to connect to the video call</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <StreamVideo client={streamClient}>
                      <StreamCall call={call}>
                        <VideoCallUI chatClient={chatClient} channel={channel} />
                      </StreamCall>
                    </StreamVideo>
                  </div>
                )}
              </div>
            </Panel>
          </PanelGroup>
        </div>

        {showEndSessionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm">
            <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">End Session?</h3>
              <p className="text-base-content/70 mb-6">
                Are you sure you want to end this session? All participants will be notified and the session will be marked as completed.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowEndSessionModal(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEndSession}
                  disabled={endSessionMutation.isPending}
                  className="btn btn-error"
                >
                  {endSessionMutation.isPending ? (
                    <>
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    "End Session"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
        {showChangeProblemModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm p-4">
            <div className="bg-base-100 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

              <div className="p-4 border-b border-white/10 flex items-center justify-center relative bg-base-100 z-10">
                <h3 className="text-xl font-bold">Change Problem</h3>
                <button className="btn btn-ghost btn-circle btn-sm absolute right-4" onClick={() => setShowChangeProblemModal(false)}>✕</button>
              </div>

              <div className="p-4 border-b border-white/5 space-y-4 bg-base-200/50">
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 size-4" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    className="input input-bordered w-full pl-10 bg-base-100 focus:outline-none focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setFilterDifficulty("all")} className={`btn btn-xs rounded-full ${filterDifficulty === "all" ? "btn-primary" : "btn-ghost"}`}>All</button>
                  <button onClick={() => setFilterDifficulty("easy")} className={`btn btn-xs rounded-full ${filterDifficulty === "easy" ? "btn-success btn-outline" : "btn-ghost"}`}>Easy</button>
                  <button onClick={() => setFilterDifficulty("medium")} className={`btn btn-xs rounded-full ${filterDifficulty === "medium" ? "btn-warning btn-outline" : "btn-ghost"}`}>Medium</button>
                  <button onClick={() => setFilterDifficulty("hard")} className={`btn btn-xs rounded-full ${filterDifficulty === "hard" ? "btn-error btn-outline" : "btn-ghost"}`}>Hard</button>
                </div>
              </div>

            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {Object.values(PROBLEMS)
                .filter((p) => {
                  const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesFilter = filterDifficulty === "all" || p.difficulty === filterDifficulty;
                  return matchesSearch && matchesFilter;
                })
                .map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => handleChangeProblem(problem.title)}
                    className={`w-full text-left p-4 rounded-xl border transition-all hover:bg-base-200 flex items-center justify-between group ${session?.problem === problem.title
                      ? "border-primary bg-primary/5"
                      : "border-base-300 bg-base-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${problem.difficulty === "easy" ? "bg-success/10 text-success" :
                        problem.difficulty === "medium" ? "bg-warning/10 text-warning" : "bg-error/10 text-error"
                        }`}>
                        <Code2Icon className="size-5" />
                      </div>
                      <div>
                        <span className="font-semibold block">{problem.title}</span>
                        <span className="text-xs text-base-content/50 capitalize">{problem.difficulty}</span>
                      </div>
                    </div>

                    {session?.problem === problem.title && <CheckIcon className="size-5 text-primary" />}
                  </button>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end bg-base-100">
              <button
                onClick={() => setShowChangeProblemModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
  </div>
);
}

export default SessionPage;
