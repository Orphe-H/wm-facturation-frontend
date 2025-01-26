import { getApiUrl, setAccessToken } from "@/lib/helpers";

export async function login(formData: FormData) {
	const apiUrl = getApiUrl();

	try {
		const response = await fetch(`${apiUrl}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: formData.get("email"),
				password: formData.get("password"),
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			return {
				errors: errorData.message || ["Une erreur s'est produite"],
			};
		}

		const jsonData = await response.json();

		const accessToken = jsonData.access_token;

		if (accessToken) {
			setAccessToken(accessToken);
		}

		return jsonData;
	} catch (error) {
		console.error("Login request failed:", error);
		return {
			errors: ["Une erreur s'est produite lors de la connexion"],
		};
	}
}
