import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("access_token");

	if (!token || !token.value) {
		const response = NextResponse.redirect(new URL("/", req.url));
		response.cookies.set("alert", "token_missing", {
			path: "/",
			httpOnly: false,
			sameSite: "strict",
		});

		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"],
};
