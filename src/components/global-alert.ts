"use client";

import { useEffect } from "react";
import { toastAlert } from "@/lib/helpers";
import { useAlertStore } from "@/stores/alert-store";

export function GlobalAlert() {
	const { message, type, clearAlert } = useAlertStore();

	useEffect(() => {
		if (message && type) {
			toastAlert({ message, type });
			clearAlert();
		}

		const alertCookie = document.cookie
			.split("; ")
			.find((row) => row.startsWith("alert="));

		if (alertCookie) {
			const alertValue = alertCookie.split("=")[1];

			if (alertValue === "token_missing") {
				toastAlert({
					message: "Vous devez d'abord vous connecter !",
					type: "error",
				});
				clearAlert();
			} else if (alertValue === "new_login") {
				toastAlert({
					message: "Bienvenue !",
					type: "success",
				});
				clearAlert();
			}

			document.cookie =
				"alert=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=none; secure;";
		}
	}, [message, type, clearAlert]);

	return null;
}
