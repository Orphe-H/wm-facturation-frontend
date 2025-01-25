import { toast } from "sonner";

export function getToken(): string | undefined {
	return document.cookie
		.split(";")
		.find((c) => c.trim().startsWith("access_token="))
		?.split("=")[1];
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
