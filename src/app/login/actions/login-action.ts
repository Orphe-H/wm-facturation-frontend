import { setAccessToken } from "@/lib/helpers";
import { fetcher } from "@/lib/requestor";

interface LoginResponseData {
	access_token: string;
	expires_in: string;
	message: string;
}

export async function login(
	formData: FormData
): Promise<{ success: boolean; errors?: string[] }> {
	const response = await fetcher({
		url: "/auth/login",
		method: "POST",
		body: JSON.stringify({
			email: formData.get("email"),
			password: formData.get("password"),
		}),
		withToken: false,
	});

	const { success, data } = response;

	if (success && data) {
		const { access_token } = data as LoginResponseData;
		if (access_token) {
			setAccessToken(access_token);
		}

		return { success: success };
	} else {
		return response;
	}
}
