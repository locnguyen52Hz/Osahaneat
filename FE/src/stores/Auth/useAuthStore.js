import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import endpoints from "../../api/endpoints";
import { apiGet, apiPost } from "../../api/api";
import axios from "axios";

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  myId: null,
  username: null,
  role: null,
  isInitializing: true,
  isLoading: false,

  setAuth: (accessToken, username, userId, role) => {
    try {
      set({
        accessToken,
        myId: userId,
        username,
        role,
      });
    } catch (err) {
      console.error("Invalid token");

      set({
        accessToken: null,
        myId: null,
        username: null,
        role: null,
      });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(
        endpoints.auth.login,
        {
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      const { accessToken, refreshToken, user } = res.data.data;
      console.log(res);

      if (accessToken) {
        const resRole = await axios.get(endpoints.auth.role, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const { setAuth, setInitializing } = get();
        setAuth(
          accessToken,
          user.fullName,
          user.id,
          resRole.data.data.roleName,
        );
        setInitializing(false);
        // console.log(resRole.data.data);
        return resRole.data.data.roleName;
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    try {
      const res = await axios.post(
        endpoints.auth.refresh,
        {},
        {
          withCredentials: true,
        },
      );

      const { accessToken, user } = res.data.data;
      console.log(res.data.data);

      const decoded = jwtDecode(accessToken);

      set({
        accessToken,
        myId: user.id,
        username: user.fullName,
        role: user.role,
      });

      return true;
    } catch (error) {
      set({
        accessToken: null,
        myId: null,
        username: null,
        role: null,
      });

      return false;
    } finally {
      set({
        isInitializing: false,
      });
    }
  },

  clearAuth: () => {
    set({
      accessToken: null,
      myId: null,
      username: null,
      role: null,
    });
  },

  setInitializing: (value) => {
    set({
      isInitializing: value,
    });
  },
}));
