"use client";

import { useEffect } from "react";
import { useProductStore } from "@/stores/product-store";
import Swal from "sweetalert2";
import { useAlertStore } from "@/stores/alert-store";
import { ERROR_MESSAGES } from "@/lib/messages";
import Link from "next/link";

export default function ProductsPage() {
	const {
		products,
		fetchProducts,
		removeProduct,
		removeErrors,
		removeSuccess,
	} = useProductStore();
	const setAlert = useAlertStore((state) => state.setAlert);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleDelete = (id: string | null) => {
		if (id) {
			Swal.fire({
				title: "Êtes-vous sûr ?",
				text: "Vous ne pourrez pas annuler cette action !",
				icon: "warning",
				confirmButtonColor: "#d33",
				confirmButtonText: "Oui, supprimer !",
				showCancelButton: true,
				cancelButtonText: "Annuler",
				cancelButtonColor: "#3085d6",
			}).then((result) => {
				if (result.isConfirmed) {
					removeProduct(id);
				}
			});
		}
	};

	useEffect(() => {
		if (removeSuccess === true) {
			setAlert("Le produit a été supprimé.", "success");
		}
	}, [removeSuccess, setAlert]);

	useEffect(() => {
		if (removeErrors) {
			if (Array.isArray(removeErrors)) {
				removeErrors.forEach((error) => {
					setAlert(error, "error");
				});
			} else {
				setAlert(removeErrors || ERROR_MESSAGES.default, "error");
			}
		}
	}, [removeErrors, setAlert]);

	return (
		<div>
			<h2 className="font-medium text-lg">Liste des produits</h2>
			<div className="flex justify-end">
				<Link
					className="px-4 py-1 text-blue-500 rounded-md bg-blue-100 hover:bg-blue-200 border shadow-sm hover:shadow"
					href="/admin/products/create"
				>
					Ajouter
				</Link>
			</div>
			<div className="mt-4 overflow-x-auto shadow-sm">
				<table className="min-w-full text-gray-800 mt-4">
					<thead>
						<tr className="border bg-white text-gray-600 font-medium">
							<td className="pl-6 py-3 text-start pr-3">Nom</td>
							<td className="text-start pr-3">Prix</td>
							<td className="text-start pr-3">Actions</td>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => (
							<tr key={product.id} className="bg-white border">
								<td className="pl-6 py-4 pr-3">
									{product.name}
								</td>
								<td className="pr-3">{product.price} FCFA</td>
								<td className="pr-3">
									<button
										className="text-blue-500 mr-2"
										onClick={() =>
											alert("Éditer le produit")
										}
									>
										Modifier
									</button>
									<button
										className="text-red-500"
										onClick={() => handleDelete(product.id)}
									>
										Supprimer
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
