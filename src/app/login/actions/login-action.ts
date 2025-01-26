import { setAccessToken } from "@/lib/helpers";
import { fetcher } from "@/lib/requestor";

export async function login(formData: FormData) {
	const response = await fetcher<{
		message: string;
		access_token: string;
		expires_in: string;
	}>({
		url: "/auth/login",
		method: "POST",
		body: JSON.stringify({
			email: formData.get("email"),
			password: formData.get("password"),
		}),
		withToken: false,
		enableLogout: false,
	});

	if (response.success && response.data) {
		const data = response.data;
		const accessToken = data.access_token;
		if (accessToken) {
			setAccessToken(accessToken);
		}

		return data;
	} else {
		return response;
	}
}
