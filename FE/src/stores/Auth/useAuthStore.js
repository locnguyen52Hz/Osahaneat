import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  myId: null,

  loadUserFromToken: () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ myId: null });
      return;
    }

    try {
      const decoded = jwtDecode(token);
      set({ myId: decoded.userID });
    } catch (err) {
      console.error("Invalid token");
      set({ myId: null });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ myId: null });
  },
}));