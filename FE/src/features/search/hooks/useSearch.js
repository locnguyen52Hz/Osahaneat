import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildSearchUrl } from "../service/searchService";
export function useSearch() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!keyword.trim()) return;

    navigate(buildSearchUrl(keyword));
  };

  return {
    keyword,
    setKeyword,
    handleSearch,
  };
}
