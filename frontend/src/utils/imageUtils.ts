/**
 * Convert a stored file path to an accessible API URL
 * Handles both full system paths and relative paths
 */
export function getProperImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  // If it's already a full URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Extract filename from full path or relative path
  const filename = imagePath.split(/[\\/]/).pop();
  
  if (!filename) return null;

  // Construct API URL
  const apiBase = "http://localhost:3000";
  return `${apiBase}/uploads/${filename}`;
}
