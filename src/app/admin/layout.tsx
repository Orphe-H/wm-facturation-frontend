"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "./actions/logout-action";
import { useAlertStore } from "@/stores/alert-store";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const setAlert = useAlertStore((state) => state.setAlert);

	const handleLogout = async () => {
		setPending(true);

		try {
			const result = await logout();

			if (result.success) {
				setAlert("Déconnexion réussie.", "success");
				router.push("/");
			} else {
				if (Array.isArray(result.errors)) {
					result.errors.forEach((error) => {
						setAlert(error, "error");
					});
				} else {
					setAlert("Une erreur inconnue s'est produite", "error");
				}
			}
		} catch (error) {
			setAlert(
				"Une erreur s'est produite lors de la déconnexion.",
				"error"
			);
			console.log(error);
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<aside className="w-64 bg-gray-50 text-gray-800 flex flex-col shadow-sm border-r">
				<div className="p-4 text-xl font-bold">
					Application de facturation
				</div>
				<nav className="mt-2 flex-1 py-4 px-3 space-y-2">
					<a
						href="/admin/products"
						className="block py-2 px-4 rounded hover:bg-gray-200"
					>
						Produits
					</a>
					<a
						href="/admin/clients"
						className="block py-2 px-4 rounded hover:bg-gray-200"
					>
						Clients
					</a>
					<a
						href="/admin/invoices"
						className="block py-2 px-4 rounded hover:bg-gray-200"
					>
						Factures
					</a>
				</nav>
				<div className="p-4 text-sm text-gray-500">
					© 2025 Bobby Orphé H.
					<br />
					Waouh monde Facturation
				</div>
			</aside>

			{/* Contenu principal */}
			<div className="flex-1 flex flex-col">
				{/* Barre supérieure */}
				<header className="h-16 border-b bg-gray-50 flex items-center justify-between px-6">
					<h1 className="text-lg font-semibold">
						{/* Tableau de bord */}
					</h1>
					<button
						onClick={handleLogout}
						type="button"
						disabled={pending}
						className="text-red-500 bg-transparent px-4 py-1.5 border rounded-md hover:text-red-600 hover:bg-red-100 hover:shadow"
					>
						{pending ? "Déconnexion..." : "Se déconnecter"}
					</button>
				</header>

				{/* Contenu */}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
