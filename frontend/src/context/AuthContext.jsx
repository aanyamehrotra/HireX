import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Loader2Icon } from "lucide-react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

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
        setIsSigningUp(true);
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            setAuthUser(res.data);
            toast.success("Account created successfully");
            return true;
        } catch (error) {
            console.error("Signup error:", error);
            const message = error.response?.data?.message || "Registration failed";
            toast.error(message);
            return false;
        } finally {
            setIsSigningUp(false);
        }
    };

    const login = async (data) => {
        setIsLoggingIn(true);
        try {
            const res = await axiosInstance.post("/auth/login", data);
            setAuthUser(res.data);
            toast.success("Logged in successfully");
            return true;
        } catch (error) {
            console.error("Login error:", error);
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            return false;
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setAuthUser(null);
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                authUser,
                isCheckingAuth,
                isSigningUp,
                isLoggingIn,
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
