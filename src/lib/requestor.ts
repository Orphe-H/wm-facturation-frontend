export const fetcher = async (
	url: string,
	withToken: boolean = true,
	options: RequestInit = {}
) => {
	const headers = new Headers(options.headers);

	if (withToken) {
		const token = localStorage.getItem("access_token");
		if (!token) {
			throw new Error("Pas de token trouvé");
		}

		headers.set("Authorization", `Bearer ${token}`);
	}

	const response = await fetch(url, { ...options, headers });

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Erreur de la requête");
	}

	return response.json();
};
