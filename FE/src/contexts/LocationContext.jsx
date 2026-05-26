import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../app/providers/UseContext";

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // null rõ ràng hơn {}
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      // reset state khi logout
      setLocation(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: { "Accept-Language": "vi" },
            }
          );

          const data = await res.json();

          setLocation({
            address: data.display_name,
            latitude,
            longitude,
          });
        } catch (err) {
          setError("Không thể lấy thông tin vị trí");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Đã từ chối truy cập vị trí");
        setLoading(false);
      }
    );
  }, [token]);

  const isReady = !loading && !error && location !== null;

  return (
    <LocationContext.Provider
      value={{
        location,        // data thật
        loading,         // trạng thái
        error,           // lỗi
        isReady,         // derived boolean
        setLocation,     // cho phép override nếu cần
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);