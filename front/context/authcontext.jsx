import { createContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";

// Load backend URL from .env
const backendURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendURL;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ✅ Check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check-auth");
      
      if (data.success) {
        setAuthUser(data.user);
        
        connectSocket(data.user);
      }
    } catch (error) {
      console.error("Auth check error:", error.message);
      toast.error("Session expired or unauthorized");
    }
  };

  // ✅ Login user and set token
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);

        // Set token for future axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        setToken(data.token);
        localStorage.setItem("token", data.token);

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ Logout user and cleanup
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    // setOnlineUsers([]);

    // Remove Authorization header
    delete axios.defaults.headers.common["Authorization"];

    toast.success("Logged out successfully");

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // ✅ Update profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Update profile error:", error.message);
      toast.error("Failed to update profile");
    }
  };

  // ✅ Connect Socket.io
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendURL, {
      query: { userId: userData._id, },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    })
  };

  // ✅ Initialize axios headers on mount
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
      
    }
  }, []);

  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    checkAuth,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      <Toaster />
      {children}
    </AuthContext.Provider>
  );
};
