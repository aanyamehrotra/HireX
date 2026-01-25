import { Link, useLocation } from "react-router-dom";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon, LogOut, TerminalIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { authUser, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative size-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-lg blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
            <div className="relative size-9 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-inner border border-white/10">
              <TerminalIcon className="size-5 text-white" />
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-lg font-display tracking-tight text-white">
              HireX
            </span>
          </div>
        </Link>

        {/* PUBLIC STATE - Login/Signup */}
        {!authUser && (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          </div>
        )}

        {/* PRIVATE STATE - Links & User Profile */}
        {authUser && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
              {/* DASHBORD PAGE LINK */}
              <Link
                to={"/dashboard"}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${isActive("/dashboard")
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <LayoutDashboardIcon className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* PROBLEMS PAGE LINK */}
              <Link
                to={"/problems"}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                ${isActive("/problems")
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <BookOpenIcon className="size-4" />
                <span className="hidden sm:inline">Problems</span>
              </Link>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="group flex items-center gap-3 cursor-pointer outline-none">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-white group-hover:text-primary transition-colors">{authUser.name}</div>
                  <div className="text-xs text-gray-500 font-mono capitalize">{authUser.role}</div>
                </div>
                <div className="size-9 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  {authUser.profileImage ? (
                    <img src={authUser.profileImage} alt={authUser.name} className="size-full rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-gray-400 group-hover:text-white">{authUser.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-[#111] border border-white/10 rounded-xl w-52 mt-4 space-y-1">
                <li>
                  <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium w-full text-left">
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
