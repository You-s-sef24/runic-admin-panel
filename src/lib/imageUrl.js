export function imageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${import.meta.env.VITE_BASE_URL}/uploads/${path}`;
}
