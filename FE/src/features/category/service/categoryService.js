import { api } from "../../../api/api";
import endpoints from "../../../api/endpoints";

export const getCategories = async () => {
  const res = await api.get(endpoints.category.all);
  return res.data.data;
};

