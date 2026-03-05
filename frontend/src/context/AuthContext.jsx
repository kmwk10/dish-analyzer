import { createContext, useState, useEffect } from "react";
import { getUserInfo } from "../api/user";
import { logout as apiLogout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access_token"));
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchUser() {
      try {
        const user = await getUserInfo();
        setCurrentUserId(user.id);
        setUserRole(user.role);
      } catch (err) {
        console.error(err);
        setIsAuthenticated(false);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/auth");
      }
    }

    fetchUser();
  }, [isAuthenticated, navigate]);

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await apiLogout(refreshToken);
      }
    } catch (err) {
      console.error("Ошибка при логауте:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setIsAuthenticated(false);
      setUserRole(null);
      setCurrentUserId(null);
      navigate("/auth");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        currentUserId,
        setCurrentUserId,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}