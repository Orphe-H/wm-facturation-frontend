import { getAccessToken, getApiUrl, removeAccessToken } from "@/lib/helpers";

export async function logout() {
	const apiUrl = getApiUrl();
	const accessToken = getAccessToken();

	try {
		if (!accessToken) {
			throw new Error("NEXT_PUBLIC_API_URL is not defined in .env");
		}

		const response = await fetch(`${apiUrl}/auth/logout`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			const errorData = await response.json();

			if (response.status === 401) {
				removeAccessToken();
			}
			
			return {
				success: false,
				errors: errorData.message || ["Une erreur s'est produite"],
			};
		}

		removeAccessToken();

		return { success: true };
	} catch (error) {
		console.error("Logout request failed:", error);
		return {
			errors: ["Une erreur s'est produite lors de la déconnexion"],
		};
	}
}
