import { useNavigate } from "react-router";
import { useState } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import toast from "react-hot-toast";

import BackgroundSquares from "../components/BackgroundSquares";

function DashboardPage() {
  const navigate = useNavigate();
  const { authUser } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = (data) => {
    // data contains problem, difficulty, and scheduledAt
    createSessionMutation.mutate(
      {
        problem: data.problem,
        difficulty: data.difficulty?.toLowerCase(),
        scheduledAt: data.scheduledAt,
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          // if scheduled, maybe show toast instead of navigating right away? 
          // Requirement says "immediate sessions still work", "scheduled work cleanly"
          // If scheduled, stay on dashboard. If active, navigate.
          if (data.session.status === "active") {
            navigate(`/session/${data.session._id}`);
          } else {
            toast.success("Session scheduled successfully!");
          }
        },
      }
    );
  };

  const handleJoinSession = (sessionId) => {
    // In a real app we might validate the session ID exists first
    navigate(`/session/${sessionId}`);
    toast.success("Joining session...");
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!authUser?._id) return false;

    // Check if user is host or participant using _id
    return session.host?._id === authUser._id || session.participant?._id === authUser._id;
  };

  return (
    <>
      <div className="min-h-screen text-gray-200 font-sans">
        <BackgroundSquares />
        <Navbar />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <WelcomeSection
            user={authUser}
            onCreateSession={() => setShowCreateModal(true)}
            onJoinSession={handleJoinSession}
          />

          {/* Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
