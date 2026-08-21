import { create } from "zustand";
import endpoints from "../../api/endpoints";

import axios from "axios";
import { authApi } from "../../api/authApi";

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
      const res = await authApi.post(endpoints.auth.login, {
        email: credentials.email,
        password: credentials.password,
      });
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
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: async () => {
    try {
      const res = await authApi.post(endpoints.auth.refresh);

      const { accessToken, user } = res.data.data;
      // console.log(accessToken);

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

  clearAuth: async () => {
    try {
      const res = await authApi.post(endpoints.auth.logout);
      console.log(res);
      set({
        accessToken: null,
        myId: null,
        username: null,
        role: null,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  setInitializing: (value) => {
    set({
      isInitializing: value,
    });
  },
}));
