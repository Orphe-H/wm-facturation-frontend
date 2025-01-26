import { toast } from "sonner";

export function getApiUrl(): string {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (!apiUrl) {
		throw new Error("NEXT_PUBLIC_API_URL is not defined in .env");
	}

	return apiUrl;
}

export function setAccessToken(accessToken: string) {
	document.cookie = `access_token=${accessToken}; path=/; Secure; SameSite=Strict`;
	localStorage.setItem("access_token", accessToken);
}

export function getAccessToken(): string | undefined {
	return document.cookie
		.split(";")
		.find((c) => c.trim().startsWith("access_token="))
		?.split("=")[1];
}

export function removeAccessToken() {
	document.cookie =
		"access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=None";
	localStorage.removeItem("access_token");
}

interface AlertProps {
	message: string;
	type: "success" | "error" | "info" | "warning";
}

export function toastAlert({ message, type }: AlertProps) {
	if (type === "success") {
		toast.success(message);
	} else if (type === "error") {
		toast.error(message);
	} else if (type === "info") {
		toast.info(message);
	} else if (type === "warning") {
		toast.warning(message);
	} else {
		toast.message(message);
	}
}

export function getStatusLabel(string: string): string {
	if (string === "paid") {
		return "Payé";
	} else if (string === "pending") {
		return "En attente";
	} else if (string === "cancelled") {
		return "Annnulé";
	} else {
		return string;
	}
}

export function formatDate(dateString: string | null) {
	if (!dateString) {
		return "";
	}

	const date = new Date(dateString);

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}-${month}-${year} ${hours}:${minutes}`;
}
