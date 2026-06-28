import { create } from "zustand";

export const useLocationStore = create((set, get) => ({
  // ======================
  // state
  // ======================
  currentLocation: null,
  selectedAddress: null,
  savedAddresses: [],
  loading: false,
  error: null,

  // ======================
  // setters
  // ======================

  setSelectedAddress: (address) =>
    set({
      selectedAddress: address,
    }),

  setSavedAddresses: (addresses) =>
    set({
      savedAddresses: addresses,
    }),

  resetLocation: () =>
    set({
      currentLocation: null,
      selectedAddress: null,
      savedAddresses: [],
      loading: false,
      error: null,
    }),

  // ======================
  // detect current location
  // ======================

  detectCurrentLocation: async () => {
    if (!navigator.geolocation) {
      set({
        error: "Trình duyệt không hỗ trợ định vị",
      });

      return;
    }

    set({
      loading: true,
      error: null,
    });

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            "Accept-Language": "vi",
          },
        },
      );

      const data = await res.json();

      const currentLocation = {
        id: null,
        type: "CURRENT",
        label: "Vị trí hiện tại",
        address: data.display_name,
        latitude,
        longitude,
      };

      set({
        currentLocation,
        selectedAddress: get().selectedAddress ?? currentLocation,
        loading: false,
      });
    } catch {
      set({
        error: "Không thể lấy vị trí hiện tại",
        loading: false,
      });
    }
  },
}));
