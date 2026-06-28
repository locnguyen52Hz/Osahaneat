import { apiGet } from "../../../api/api";
import endpoints from "../../../api/endpoints";

export const getCategories = async () => {
  const res = await apiGet(endpoints.category.all);
  return res.data.data;
};

