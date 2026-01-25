import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Loader2, Mail, Lock, User, Briefcase, Zap } from "lucide-react";
import toast from "react-hot-toast";
import BackgroundSquares from "../components/BackgroundSquares";
import GlassCard from "../components/GlassCard";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "candidate", // default role
    });

    const { register, isSigningUp } = useAuth();

    const validateForm = () => {
        if (!formData.name.trim()) return toast.error("Name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = validateForm();
        if (success === true) register(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans text-gray-200">
            <BackgroundSquares />

            <div className="w-full max-w-lg p-4 relative z-10">
                <GlassCard className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center size-12 rounded-xl bg-secondary/20 text-secondary mb-4 shadow-inner border border-white/5">
                            <Zap className="size-6" />
                        </div>
                        <h1 className="text-3xl font-bold font-display tracking-tight text-white">Create Account</h1>
                        <p className="text-gray-400 mt-2">Join the future of technical interviewing</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white placeholder-gray-500"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-gray-500" />
                                </div>
                                <input
                                    type="email"
                                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white placeholder-gray-500"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-gray-500" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-10 pr-12 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-white placeholder-gray-500"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3 pt-2">
                            <label className="text-sm font-medium text-gray-300">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${formData.role === 'candidate'
                                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10 ring-1 ring-primary/50'
                                            : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5'
                                        }`}
                                    onClick={() => setFormData({ ...formData, role: 'candidate' })}
                                >
                                    {formData.role === 'candidate' && (
                                        <div className="absolute top-2 right-2 size-2 rounded-full bg-primary shadow flex animate-pulse" />
                                    )}
                                    <User className={`size-6 mb-2 ${formData.role === 'candidate' ? 'text-primary' : 'text-gray-400'}`} />
                                    <h3 className={`font-semibold ${formData.role === 'candidate' ? 'text-white' : 'text-gray-300'}`}>Candidate</h3>
                                    <p className="text-xs text-gray-500">Practice interviews</p>
                                </div>
                                <div
                                    className={`relative p-4 rounded-xl border cursor-pointer transition-all ${formData.role === 'interviewer'
                                            ? 'border-secondary bg-secondary/10 shadow-lg shadow-secondary/10 ring-1 ring-secondary/50'
                                            : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/5'
                                        }`}
                                    onClick={() => setFormData({ ...formData, role: 'interviewer' })}
                                >
                                    {formData.role === 'interviewer' && (
                                        <div className="absolute top-2 right-2 size-2 rounded-full bg-secondary shadow flex animate-pulse" />
                                    )}
                                    <Briefcase className={`size-6 mb-2 ${formData.role === 'interviewer' ? 'text-secondary' : 'text-gray-400'}`} />
                                    <h3 className={`font-semibold ${formData.role === 'interviewer' ? 'text-white' : 'text-gray-300'}`}>Interviewer</h3>
                                    <p className="text-xs text-gray-500">Conduct interviews</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 px-4 bg-gradient-to-r from-primary to-secondary rounded-lg text-white font-bold shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
export default SignUpPage;
