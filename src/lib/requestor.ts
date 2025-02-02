import { getAccessToken, getApiUrl, removeAccessToken } from "./helpers";
import { ERROR_MESSAGES } from "./consts";
import { HTTP_METHOD } from "./enums";

interface FetcherOptions {
	url: string;
	method?:  HTTP_METHOD.GET | HTTP_METHOD.POST | HTTP_METHOD.PUT | HTTP_METHOD.PATCH | HTTP_METHOD.DELETE;
	body?: BodyInit | null;
	withToken?: boolean;
	enableLogout?: boolean;
}

export const fetcher = async <T>({
	url,
	method = HTTP_METHOD.GET,
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

	if (withToken) {
		if (accessToken) {
			headers.Authorization = `Bearer ${accessToken}`;
		} else {
			return {
				success: false,
				status_code: 401,
				errors: [ERROR_MESSAGES.unauthorized],
			};
		}
	}

	try {
		const response = await fetch(apiUrl + url, {
			method,
			headers,
			...(body ? { body } : {}),
		});

		const statusCode = response.status;

		if (statusCode === 401 && enableLogout) {
			removeAccessToken();
			return {
				success: false,
				status_code: statusCode,
				errors: [ERROR_MESSAGES.unauthorized],
			};
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
