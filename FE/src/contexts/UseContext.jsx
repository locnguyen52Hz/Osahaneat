import axios from "axios";
import { createContext, useState, useContext, useEffect } from "react";
import endpoints from "../api/endpoints";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedUsername = localStorage.getItem("username");

    if (savedToken && savedRole && savedUsername) {
      setToken(savedToken);
      setRole(savedRole);
      setUsername(savedUsername);
    }

    setLoading(false); // kết thúc trạng thái loading
  }, []);

  const saveAuthData = (tokenValue, roleValue, usernameValue) => {
    if (tokenValue) {
      localStorage.setItem("token", tokenValue);
      setToken(tokenValue);
    }

    if (roleValue) {
      localStorage.setItem("role", roleValue);
      setRole(roleValue);
    }
    if (usernameValue) {
      localStorage.setItem("username", usernameValue);
      setUsername(usernameValue);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setRole('');
    setToken('');
    setUsername('');
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post(
        endpoints.auth.login,
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Đăng nhập: ", credentials);
      const token = res.data.token;
      const username = res.data.data;

      if (token && username) {
        const roleRes = await axios.get(endpoints.auth.role, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const roleName = roleRes.data.data.roleName;
        saveAuthData(token, roleName, username);
      
        return roleName;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        token,
        role,
        saveAuthData,
        clearAuthData,
        login,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
