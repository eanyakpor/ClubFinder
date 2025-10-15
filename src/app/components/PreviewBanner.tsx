"use client";

import { IS_PREVIEW } from "../lib/config";

export default function PreviewBanner() {
  if (!IS_PREVIEW) return null;
  return (
    <div className="w-full bg-yellow-400 text-black text-center text-sm py-2">
      PREVIEW — mock data, writes disabled
    </div>
  );
}