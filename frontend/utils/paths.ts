export const getAssetUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (url.startsWith('/')) {
    return `${basePath}${url}`;
  }
  return `${basePath}/${url}`;
};
