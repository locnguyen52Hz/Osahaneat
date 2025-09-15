import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UseContext";

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const {token} = useAuth()
  console.log(location);


  useEffect(() => {
    if(!token) return;


    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          setLocation({ address: data.address, latitude, longitude });

        } catch (err) {
          console.error("Không thể lấy thông tin vị trí");
        } finally {
          setLoading(false);
        }
      },
      () => {
        //từ chối quyền truy cập vị trí
        setError("Đã từ chối truy cập vị trí");
        setLoading(false);
      }
    );
  }, [token]);

  const ready = !loading && !error && location

  return (
    <LocationContext.Provider value={{ location, setLocation, loading, error, ready }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
