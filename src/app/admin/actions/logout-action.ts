import { removeAccessToken } from "@/lib/helpers";
import { fetcher } from "@/lib/requestor";

export async function logout() {
	const response = await fetcher<{
		message: string;
	}>({
		url: "/auth/logout",
		method: "POST",
	});

	if (response.success) {
		removeAccessToken();

		return { success: true };
	} else {
		return response;
	}
}
