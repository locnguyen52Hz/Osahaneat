import { useNavigate } from "react-router-dom";

const normalizeParams = (params) => {
  return Object.fromEntries(
    Object.entries(params)
      .map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
      .filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
  );
};

export function useSearch(buildUrl) {
  const navigate = useNavigate();

  const search = (params) => {
    const normalized = normalizeParams(params);

    if (Object.keys(normalized).length === 0) {
      return;
    }

    navigate(buildUrl(normalized));
  };

  return search;
}
