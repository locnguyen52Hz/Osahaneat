import React, { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { apiGet } from "../api/api";

function Routing({ from, to }) {
  const map = useMap();
  const [route, setRoute] = useState(null);
  const polylineRef = useRef(null); // giữ ref để cleanup chắc chắn
  const mountedRef = useRef(true);
  const prevCoordsRef = useRef(null);

  const isSameCoords = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];

  useEffect(() => {
    if (!from || !to) return;
    const prev = prevCoordsRef.current;
    if (prev && isSameCoords(prev.from, from) && isSameCoords(prev.to, to)) {
      console.log("⚡ Bỏ qua vì trùng dữ liệu cũ");
      return;
    }
    prevCoordsRef.current = { from, to };

    const fetchRoute = async () => {
      try {
        const res = await apiGet(
          `http://localhost:8080/api/routes?fromLat=${from[1]}&fromLong=${from[0]}&toLat=${to[1]}&toLong=${to[0]}`
        );
        if (!mountedRef.current) return; // tránh setState khi unmounted

        const data = res.data;
        const coords =
          data.routes?.[0]?.geometry?.coordinates?.map((c) => [c[1], c[0]]) ||
          [];

        if (coords.length > 1) {
          setRoute(coords);
        } else {
          setRoute(null);
        }
      } catch (err) {
        console.error("Routing API error:", err);
      }
    };

    fetchRoute();
  }, [from, to]);

  useEffect(() => {
    if (!map || !route || route.length < 2) return;

    // Xóa polyline cũ
    if (polylineRef.current && map.hasLayer(polylineRef.current)) {
      map.removeLayer(polylineRef.current);
    }

    // Vẽ polyline mới
    const newPolyline = L.polyline(route, { color: "blue" }).addTo(map);
    polylineRef.current = newPolyline;

    try {
      map.fitBounds(newPolyline.getBounds());
    } catch (e) {
      console.warn("fitBounds error:", e);
    }

    return () => {
      if (polylineRef.current && map && map.hasLayer(polylineRef.current)) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map, route]);

  return null;
}

export default Routing;
