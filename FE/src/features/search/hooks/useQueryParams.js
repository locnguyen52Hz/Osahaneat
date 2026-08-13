import { useNavigate, useSearchParams } from "react-router-dom";
const EXCLUSIVE_MAP = {
  keyword: ["categoryId", "category"],
  categoryId: ["keyword"],
};
export function useQueryParams() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const updateParams = (newParams) => {
    const current = Object.fromEntries(params.entries());

    let merged = {
      ...current,
      ...newParams,
    };

    // remove empty
    Object.keys(merged).forEach((key) => {
      if (
        merged[key] === "" ||
        merged[key] === null ||
        merged[key] === undefined
      ) {
        delete merged[key];
      }
    });

    Object.entries(newParams).forEach(([key]) => {
      const toRemove = EXCLUSIVE_MAP[key];
      if (toRemove) {
        toRemove.forEach((k) => delete merged[k]);
      }
    });

    navigate(`/search?${new URLSearchParams(merged)}`);
  };

  const resetSearchType = (type, newParams) => {
    const current = Object.fromEntries(params.entries());

    let cleaned = { ...current, ...newParams };

    EXCLUSIVE_MAP[type]?.forEach((key) => {
      delete cleaned[key];
    });

    return cleaned;
  };

  return { params, updateParams, resetSearchType };
}
