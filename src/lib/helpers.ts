export function getToken(): string | undefined {
	return document.cookie
		.split(";")
		.find((c) => c.trim().startsWith("access_token="))
		?.split("=")[1];
}
