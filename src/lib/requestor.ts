import { getAccessToken, getApiUrl, removeAccessToken } from "./helpers";

const ERROR_MESSAGES = {
	unauthorized: "Vous n'êtes pas autorisé. Veuillez vous reconnecter.",
	default: "Une erreur s'est produite.",
	requestFailed: "Une erreur s'est produite lors de la requête.",
};

interface FetcherOptions {
	url: string;
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
	body?: BodyInit | null;
	withToken?: boolean;
	enableLogout?: boolean;
}

export const fetcher = async <T>({
	url,
	method = "GET",
	body,
	withToken = true,
	enableLogout = true,
}: FetcherOptions): Promise<{
	success: boolean;
	status_code: number;
	data?: T;
	errors?: string[];
}> => {
	const apiUrl = getApiUrl();
	const accessToken = withToken ? getAccessToken() : null;

	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (accessToken) {
		headers.Authorization = `Bearer ${accessToken}`;
	} else {
		// logout
	}

	try {
		const response = await fetch(apiUrl + url, {
			method,
			headers,
			...(body ? { body } : {}),
		});

		const statusCode = response.status;

		if (enableLogout) {
			if (statusCode === 401) {
				removeAccessToken();
				return {
					success: false,
					status_code: statusCode,
					errors: [ERROR_MESSAGES.unauthorized],
				};
			}
		}

		if (!response.ok) {
			const errorData = await response.json();
			return {
				success: false,
				status_code: statusCode,
				errors: errorData.message || [ERROR_MESSAGES.default],
			};
		}

		const data: T = await response.json();
		return {
			success: true,
			status_code: statusCode,
			data,
		};
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("Request failed:", error);
		}

		return {
			success: false,
			status_code: 500,
			errors: [ERROR_MESSAGES.requestFailed],
		};
	}
};
