import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
	const token = req.cookies.get("access_token");

	console.log("Token from cookies: ", token);

	if (!token) {
		console.log("No token found");
		return NextResponse.redirect(new URL("/", req.url));
	}


	return NextResponse.next(); 
}

export const config = {
	matcher: ["/admin/:path*"], 
};
