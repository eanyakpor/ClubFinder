export const IS_PREVIEW =
  process.env.VERCEL_ENV === "preview" ||
  (process.env.VERCEL_ENV !== "production" &&
   process.env.NEXT_PUBLIC_APP_MODE === "preview");