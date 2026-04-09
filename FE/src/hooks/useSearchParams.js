import React from "react";
import { replace, useSearchParams } from "react-router-dom";

function useSearchParams(defaults) {
  const [params, setParams] = useSearchParams();
  const state = {};
  const setters = {};

  for (const key in defaults) {
    state[key] = params.get(key) ?? defaults[key];
    setters[key] = (value) => {
      const newParams = new URLSearchParams(params);
      newParams.set(key, value);
      setParams(newParams, { replace: true });
    };
  }

  return { state, set: setters };
}

export default useSearchParams;
