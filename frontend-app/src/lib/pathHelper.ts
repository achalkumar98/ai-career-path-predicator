const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const stripBasePath = (pathname: string) => {
  if (!basePath) return pathname;
  return pathname.startsWith(basePath) ? pathname.slice(basePath.length) || '/' : pathname;
};
