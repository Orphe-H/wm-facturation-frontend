"use client";

import { useEffect } from "react";
import { LoginForm } from "./login/ui/login-form";
import { useSearchParams } from "next/navigation";
import { toastAlert } from "@/lib/helpers";

export default function Login() {
	const searchParams = useSearchParams();
	const alert = searchParams?.get("alert");

	useEffect(() => {
		if (alert === "token_missing") {
			toastAlert({
				message: "Vous devez d'abord vous connecté!",
				type: "error",
			});
		}
	}, [alert]);

	return (
		<div className="flex min-h-screen">
			<div className="w-1/2 flex items-center justify-center">
				<span className="text-3xl font-bold">
					Waouh monde Facturation APP
				</span>
			</div>
			<div className="w-1/2 bg-gray-50 flex items-center justify-center">
				<LoginForm />
			</div>
		</div>
	);
}
