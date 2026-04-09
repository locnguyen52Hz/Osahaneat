import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UseContext";

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [myLocation, setMyLocation] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); 



  // useEffect(() => {
  //   if (!token) return;
  //   if (!navigator.geolocation) {
  //     setError("Trình duyệt không hỗ trợ định vị");
  //     setLoading(false);
  //     return;
  //   }
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       try {
  //         const res = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
  //           {
  //             headers: {
  //               "Accept-Language": "vi",
  //             },
  //           }
  //         );
  //         const data = await res.json();
      
  //         setMyLocation({
  //           address: data.display_name,
  //           latitude,
  //           longitude,
  //         });
  //       } catch (err) {
  //         console.error("Không thể lấy thông tin vị trí");
  //       } finally {
  //         setLoading(false);
  //       }
  //     },
  //     () => {
  //       //từ chối quyền truy cập vị trí
  //       setError("Đã từ chối truy cập vị trí");
  //       setLoading(false);
  //     }
  //   );
  // }, [token]);

  const isLocationReday = !loading && !error && myLocation;

  return (
    <LocationContext.Provider
      value={{ setMyLocation, error, isLocationReday }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
