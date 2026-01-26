/**
 * URL utilities for the application
 */

/**
 * Extract domain name from full URL
 * @param url - Full URL (e.g., "https://opencall.in")
 * @returns Domain name (e.g., "opencall")
 */
export const extractDomainName = (url: string): string => {
  if (!url) return "";
  
  try {
    // Remove protocol if present
    let domain = url.replace(/^(https?:\/\/)?(www\.)?/, "");
    // Remove path and query strings
    domain = domain.split("/")[0];
    // Extract just the domain name (before first dot)
    const parts = domain.split(".");
    return parts[0];
  } catch (error) {
    return url;
  }
};

/**
 * Get full URL from partial URL
 * @param url - URL that may be missing protocol
 * @returns Full URL with https protocol
 */
export const ensureFullUrl = (url: string): string => {
  if (!url) return "";
  
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

/**
 * Store image in local storage as base64
 * @param key - Storage key
 * @param imageData - Image data URL
 */
export const storeProfileImage = (key: string, imageData: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, imageData);
  }
};

/**
 * Retrieve image from local storage
 * @param key - Storage key
 * @returns Image data URL or null
 */
export const getProfileImage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

/**
 * Delete image from local storage
 * @param key - Storage key
 */
export const deleteProfileImage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
