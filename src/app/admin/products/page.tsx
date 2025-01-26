"use client";

import { useEffect } from "react";
import { useProductStore } from "@/stores/product-store";
import Swal from "sweetalert2";

export default function ProductsPage() {
	const { products, fetchProducts, removeProduct } = useProductStore();

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
					// Appel API pour supprimer
					removeProduct(id);
					// sonner alert 
					// Swal.fire(
					// 	"Supprimé !",
					// 	"Le produit a été supprimé.",
					// 	"success"
					// );
				}
			});
		}
	};

	return (
		<div className="mt-10">
			<h2 className="font-medium text-lg">Liste des produits</h2>
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
