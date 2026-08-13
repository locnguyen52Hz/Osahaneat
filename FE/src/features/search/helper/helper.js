export const updateParams = (
  params,
  setParams,
  updates
) => {
  const newParams = new URLSearchParams(params);

  Object.entries(updates).forEach(([key, value]) => {
    newParams.set(key, String(value));
  });

  setParams(newParams);
};