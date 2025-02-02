"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "./actions/logout-action";
import { useAlertStore } from "@/stores/alert-store";
import NavLink from "@/components/nav-link";
import { ERROR_MESSAGES } from "@/lib/consts";
import Link from "next/link";

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

		const result = await logout();

		if (result.success) {
			setAlert("Déconnexion réussie.", "success");
			router.push("/");
		} else {
			if (result.status_code === 401) {
				setAlert(ERROR_MESSAGES.unauthorized, "error");
				router.push("/");
			} else {
				if (Array.isArray(result.errors)) {
					result.errors.forEach((error) => {
						setAlert(error, "error");
					});
				} else if (result.errors) {
					setAlert(result.errors, "error");
				} else {
					setAlert(ERROR_MESSAGES.default, "error");
				}
			}
		}

		setPending(false);
	};

	return (
		<div className="flex h-screen bg-gray-100">
			<aside className="w-64 bg-gray-50 text-gray-800 flex flex-col shadow-sm border-r">
				<div className="p-4 text-xl font-bold">
					<Link href="/admin">Application de facturation</Link>
				</div>
				<nav className="mt-2 flex-1 py-4 px-3 space-y-2">
					<NavLink href="/admin/products">Produits</NavLink>
					<NavLink href="/admin/clients">Clients</NavLink>
					<NavLink href="/admin/invoices">Factures</NavLink>
				</nav>
				<div className="p-4 text-sm text-gray-500">
					© 2025 Bobby Orphé H.
					<br />
					Facturation APP
				</div>
			</aside>

			<div className="flex-1 flex flex-col">
				<header className="h-16 border-b bg-gray-50 flex items-center justify-between px-6">
					<h1 className="text-lg font-semibold"></h1>
					<button
						onClick={handleLogout}
						type="button"
						disabled={pending}
						className="text-red-500 bg-transparent px-4 py-1.5 border rounded-md hover:text-red-600 hover:bg-red-100 hover:shadow"
					>
						{pending ? "Déconnexion..." : "Se déconnecter"}
					</button>
				</header>

				<main className="flex-1 p-6">{children}</main>
			</div>
		</div>
	);
}
