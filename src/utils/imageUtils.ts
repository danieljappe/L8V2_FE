// Utility function to construct full URLs from relative paths
export const constructFullUrl = (relativeUrl: string | null | undefined): string => {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http')) return relativeUrl;
  // Since we have a proxy configured, we can use the relative URL directly
  // The proxy will forward the request to the backend
  return relativeUrl;
};

// Utility function to get the best available image URL from a gallery image
export const getBestImageUrl = (image: any): string => {
  // Prefer thumbnail for small displays, medium for medium displays, large for large displays
  if (image.thumbnailUrl) return constructFullUrl(image.thumbnailUrl);
  if (image.mediumUrl) return constructFullUrl(image.mediumUrl);
  if (image.largeUrl) return constructFullUrl(image.largeUrl);
  if (image.url) return constructFullUrl(image.url);
  return '';
};
