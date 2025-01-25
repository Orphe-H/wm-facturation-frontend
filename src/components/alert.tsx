"use client";

import { toast } from "sonner";

interface AlertProps {
	message: string;
	type: "success" | "error";
}

const Alert = ({ message, type }: AlertProps) => {
	if (type === "error") {
		toast.error(message);
	} else {
		toast.success(message);
	}

	return null;
};

export default Alert;
