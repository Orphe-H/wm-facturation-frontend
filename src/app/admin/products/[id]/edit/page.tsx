"use client";

import { useProductStore, Product } from "@/stores/product-store";
import { useAlertStore } from "@/stores/alert-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { product, fetchProduct, updateProduct, addErrors, addSuccess } =
		useProductStore();
	const setAlert = useAlertStore((state) => state.setAlert);
	const router = useRouter();

	const [formData, setFormData] = useState<Partial<Product>>({
		name: "",
		price: 1,
	});

	const [pending, setPending] = useState(false);
	const [errors, setErrors] = useState<string | string[]>([]);

	// Fetch product data when the page loads
	useEffect(() => {
		fetchProduct(id);
	}, [fetchProduct, id]);

	// Update formData when product is fetched
	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name,
				price: product.price,
			});
		}
	}, [product]);

	// Handle changes in the form inputs
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "price" ? Number(value) : value,
		}));
	};

	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setPending(true);

		await updateProduct(id, formData);

		setPending(false);
	};

	// Handle success and errors
	useEffect(() => {
		if (addSuccess) {
			setAlert("Produit mis à jour avec succès.", "success");
			router.push("/admin/products");
		}
	}, [addSuccess, setAlert, router]);

	useEffect(() => {
		if (addErrors) {
			setErrors(addErrors);
		} else {
			setErrors([]);
		}
	}, [addErrors]);

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
						<form onSubmit={handleSubmit}>
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
									value={formData.name}
									onChange={handleChange}
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
									value={formData.price}
									onChange={handleChange}
									className="w-full mt-1 py-2 px-2.5 bg-transparent ring-1 ring-gray-300 border-0 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 hover:ring-blue-500"
								/>
							</div>

							{errors.length > 0 && (
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
							)}

							<div className="mt-8 flex justify-end">
								<button
									type="submit"
									disabled={pending}
									className="justify-center inline-flex items-center px-4 py-2 uppercase tracking-widest text-xs font-semibold rounded-md bg-blue-600 border border-transparent text-white hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
								>
									{pending
										? "Enregistrement..."
										: "Enregistrer"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
