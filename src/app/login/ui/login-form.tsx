export function LoginForm() {
	return (
		<div className="px-5 w-full sm:max-w-lg">
			<div className="mb-7 font-semibold text-2xl text-center">
				Connectez-vous
			</div>

			<form action="">
				<div>
					<label
						htmlFor="email"
						className="block font-medium text-gray-700"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
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
						type="password"
						id="password"
						name="password"
						className="w-full mt-1 py-2 px-2.5 bg-transparent ring-1 ring-gray-300 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 hover:ring-blue-500"
					/>

					<div></div>
				</div>

				<div className="mt-4">
					<button
						type="submit"
						className="w-full justify-center inline-flex items-center px-4 py-2 uppercase tracking-widest text-xs font-semibold rounded-md bg-blue-800 border border-transparent text-white hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-offset-2 transition ease-in-out duration-150"
					>
						Se connecter
					</button>
				</div>
			</form>
		</div>
	);
}
