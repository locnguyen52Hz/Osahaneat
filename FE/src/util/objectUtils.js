// objectUtils.js

export function flattenObject(obj) {
  const result = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value));
    } else {
      result[key] = value ?? 'N/A';
    }
  });

  return result;
}
