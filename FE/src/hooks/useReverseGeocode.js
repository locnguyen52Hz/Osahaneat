import React, { useRef, useState } from "react";
import { reverseGeocode } from "../features/location/service/locationService";

const CACHE_TTL = 1000 * 60 * 5; // 5 phút
const MAX_RETRY = 2;
function useReverseGeocode() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cacheRef = useRef(new Map());
  const abortRef = useRef(null);

  const getCacheKey = (lat, lng) => `${lat.toFixed(5)}- ${lng.toFixed(5)}`;

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const fetchWithRetry = async (lat, lng, signal) => {
    let attempt = 0;
    while (attempt <= MAX_RETRY) {
      try {
        return await reverseGeocode(lat, lng, signal);
      } catch (error) {
        if (error.name === "AbortError") throw error;
        if (attempt === MAX_RETRY) throw error;

        await sleep(500 * (attempt + 1));
        attempt++;
      }
    }
  };

  const fetchAddress = async (lat, lng) => {
    const key = getCacheKey(lat, lng);

    //cache hit
    const cached = cacheRef.current.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      return;
    }

    //cancel request cũ
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchWithRetry(lat, lng, controller.signal);
      setData(res);
      console.log(res);

      //save cache
      cacheRef.current.set(key, {
        data: res,
        timestamp: Date.now(),
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, fetchAddress };
}

export default useReverseGeocode;
