export const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}`;
export const ASPIRANTES_PER_PAGE = Number(
  process.env.NEXT_PUBLIC_ASPIRANTES_PER_PAGE ?? "24",
);
