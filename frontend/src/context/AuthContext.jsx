import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check auth on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const res = await axiosInstance.get("/auth/me");
            setAuthUser(res.data);
        } catch {
            setAuthUser(null);
        } finally {
            setIsCheckingAuth(false);
        }
    };

    const register = async (data) => {
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            setAuthUser(res.data);
            toast.success("Account created successfully");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return false;
        }
    };

    const login = async (data) => {
        try {
            const res = await axiosInstance.post("/auth/login", data);
            setAuthUser(res.data);
            toast.success("Logged in successfully");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setAuthUser(null);
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                authUser,
                isCheckingAuth,
                register,
                login,
                logout,
            }}
        >
            {isCheckingAuth ? (
                <div className="flex items-center justify-center h-screen bg-base-100">
                    <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
