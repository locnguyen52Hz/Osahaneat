export const normalizeQuantity = (value) => {
  const quantity = Number(value);

  if (Number.isNaN(quantity)) return 1;

  return Math.min(99, Math.max(1, quantity));
};
