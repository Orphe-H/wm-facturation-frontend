import { HTTP_METHOD } from "@/lib/enums";
import { removeAccessToken } from "@/lib/helpers";
import { fetcher } from "@/lib/requestor";

export async function logout(): Promise<{
	success: boolean;
	errors?: string[];
	status_code: number;
}> {

	const response = await fetcher({
		url: "/auth/logout",
		method: HTTP_METHOD.POST,
	});

	if (response.success) {
		removeAccessToken();

		return { success: true, status_code: 200 };
	} else {
		return response;
	}
}
