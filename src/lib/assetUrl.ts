/**
 * Resolves a public asset path to work correctly on GitHub Pages
 * where the app is served under a subpath (e.g., /vincereee/).
 * 
 * Usage: assetUrl("/images/photo.jpg") → "./images/photo.jpg" (in production)
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path, and ensure base ends with /
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : base + '/';
  return `${cleanBase}${cleanPath}`;
}
