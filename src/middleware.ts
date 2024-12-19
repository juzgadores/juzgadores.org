// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { standbyFlag } from "@/lib/flags";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  if (url.pathname.startsWith("/aspirantes") && (await standbyFlag())) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
