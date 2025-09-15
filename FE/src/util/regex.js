

export function createQuantityRegex(min, max) {
  return new RegExp(`^(${Array.from({ length: max - min + 1 }, (_, i) => i + min).join("|")})$`);
}