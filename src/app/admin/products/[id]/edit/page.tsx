"use client";

import Link from "next/link";

export default function EditProductPage() {
	return (
		<div>
			<h2 className="font-medium text-lg">Modifier un produit</h2>

			<div className="mt-4">
				<Link
					className="px-4 py-1 rounded-md bg-gray-700 hover:bg-gray-800 text-white"
					href="/admin/products"
				>
					Retour à la liste
				</Link>
			</div>

			<div className="mt-10 flex justify-center">
				<div className="max-w-5xl w-full bg-white">
					<div className="px-10 pt-8 pb-10">
						<form action="">
							<div>
								<label
									htmlFor="name"
									className="block font-medium text-gray-700"
								>
									Nom
								</label>
								<input
									type="text"
									required
									name="name"
									// value={product.name}
									// onChange={handleChange}
									className="w-full mt-1 py-2 px-2.5 bg-transparent ring-1 ring-gray-300 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 hover:ring-blue-500"
								/>
							</div>

							<div className="mt-4">
								<label
									htmlFor="price"
									className="block font-medium text-gray-700"
								>
									Prix
								</label>
								<input
									type="number"
									min={1}
									required
									name="price"
									// value={product.price}
									// onChange={handleChange}
									className="w-full mt-1 py-2 px-2.5 bg-transparent ring-1 ring-gray-300 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 hover:ring-blue-500"
								/>
							</div>

							{/* {(Array.isArray(errors) ? errors : [errors])
								.length > 0 && (
								<div className="mt-4 text-red-500 space-y-2">
									{(Array.isArray(errors)
										? errors
										: [errors]
									).map((error, index) => (
										<p key={index} className="text-sm">
											{error}
										</p>
									))}
								</div>
							)} */}

							<div className="mt-8 flex justify-end">
								<button
									type="submit"
									// disabled={pending}
									className="justify-center inline-flex items-center px-4 py-2 uppercase tracking-widest text-xs font-semibold rounded-md bg-blue-600 border border-transparent text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
								>
									Enregistrer
									{/* {pending
										? "Enregistrement..."
										: "Enregistrer"} */}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
