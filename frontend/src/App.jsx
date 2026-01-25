import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, isCheckingAuth } = useAuth();

  if (isCheckingAuth) return null; // Or a global loading spinner

  return (
    <>
      <Routes>
        <Route path="/" element={!authUser ? <HomePage /> : <Navigate to={"/dashboard"} />} />

        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/dashboard"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/dashboard"} />} />

        <Route path="/dashboard" element={authUser ? <DashboardPage /> : <Navigate to={"/login"} />} />
        <Route path="/problems" element={authUser ? <ProblemsPage /> : <Navigate to={"/login"} />} />
        <Route path="/problem/:id" element={authUser ? <ProblemPage /> : <Navigate to={"/login"} />} />
        <Route path="/session/:id" element={authUser ? <SessionPage /> : <Navigate to={"/login"} />} />
      </Routes>

      <Toaster toastOptions={{ duration: 3000 }} />
    </>
  );
}

export default App;
