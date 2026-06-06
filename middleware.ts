import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const HIDDEN_PREFIXES = ["/humanizer", "/source-checker", "/arcade"];

export async function middleware(request: NextRequest) {
  // Optional soft gate for the hidden tool pages.
  // Set TOOLS_PASSPHRASE to require ?key=... once (stored in a cookie). Unset = unlinked + noindex only.
  const passphrase = process.env.TOOLS_PASSPHRASE;
  const path = request.nextUrl.pathname;
  if (passphrase && HIDDEN_PREFIXES.some((p) => path.startsWith(p))) {
    const provided = request.nextUrl.searchParams.get("key");
    const cookie = request.cookies.get("tools_key")?.value;
    if (provided === passphrase) {
      const res = NextResponse.next();
      res.cookies.set("tools_key", passphrase, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return res;
    }
    if (cookie !== passphrase) {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|glb)$).*)"],
};
