"use client";

import { useState } from "react";
import { login } from "../actions/login-action";
import { useRouter } from "next/navigation";

export function LoginForm() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [pending, setPending] = useState(false);
	const [errors, setErrors] = useState<string | string[]>([]);

	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const resetForm = () => {
		setFormData({
			email: "",
			password: "",
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPending(true);
		setErrors([]);

		try {
			const result = await login(
				new FormData(e.currentTarget as HTMLFormElement)
			);

			if (result.errors) {
				setErrors(result.errors);
			} else {
				resetForm();
				console.log(result);
				router.push("/admin");
			}
		} catch (error) {
			setErrors("Une erreur s'est produite lors de la connexion");
			console.error(error);
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="px-5 w-full sm:max-w-lg">
			<div className="mb-7 font-semibold text-2xl text-center">
				Connectez-vous
			</div>

			<form onSubmit={handleSubmit}>
				<div>
					<label
						htmlFor="email"
						className="block font-medium text-gray-700"
					>
						Email
					</label>
					<input
						required
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="w-full mt-1 py-2 px-2.5 bg-transparent ring-1 ring-gray-300 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 hover:ring-blue-500"
					/>
				</div>

				<div className="mt-4">
					<label
						htmlFor="password"
						className="block font-medium text-gray-700"
					>
						Mot de passe
					</label>
					<input
						required
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						className="w-full mt-1 py-2 px-2.5 bg-transparent ring-1 ring-gray-300 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 hover:ring-blue-500"
					/>
				</div>

				{(Array.isArray(errors) ? errors : [errors]).length > 0 && (
					<div className="mt-4 text-red-500 space-y-2">
						{(Array.isArray(errors) ? errors : [errors]).map(
							(error, index) => (
								<p key={index} className="text-sm">
									{error}
								</p>
							)
						)}
					</div>
				)}

				<div className="mt-4">
					<button
						type="submit"
						disabled={pending}
						className="w-full justify-center inline-flex items-center px-4 py-2 uppercase tracking-widest text-xs font-semibold rounded-md bg-blue-800 border border-transparent text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 transition ease-in-out duration-150"
					>
						{pending ? "Connexion..." : "Se connecter"}
					</button>
				</div>
			</form>
		</div>
	);
}
