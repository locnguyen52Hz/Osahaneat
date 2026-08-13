export function buildSearchUrl(params) {
  return `/search?${new URLSearchParams(params)}`;
}