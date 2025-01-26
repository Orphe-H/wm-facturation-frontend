"use client";

import { LoginForm } from "./login/ui/login-form";

export default function Login() {
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
