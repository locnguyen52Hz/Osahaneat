export function buildSearchUrl(keyword) {
  return `/search?type=shop&keyword=${encodeURIComponent(keyword)}&page=0`;
}
