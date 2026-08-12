const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getMediaUrl(
  path?: string | null
): string | null {
  if (!path) {
    return null;
  }

  if (path.startsWith("http")) {
    return path;
  }

  const serverUrl = API_URL?.replace("/api/v1", "");

  return `${serverUrl}${path}`;
}