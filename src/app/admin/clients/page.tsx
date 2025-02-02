"use client";

import Button from "@/components/button";
import { formatDateTime } from "@/lib/helpers";
import { useAlertStore } from "@/stores/alert-store";
import { useClientStore } from "@/stores/client-store";
import Link from "next/link";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function ClientsPage() {
	const { clients, fetchClients, removeClient, notification } =
		useClientStore();
	const setAlert = useAlertStore((state) => state.setAlert);

	useEffect(() => {
		fetchClients();
	}, [fetchClients]);

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
					removeClient(id);
				}
			});
		}
	};

	useEffect(() => {
		if (notification) {
			setAlert(notification.message, notification.type);
		}
	}, [notification, setAlert]);

	return (
		<div>
			<h2 className="font-medium text-lg">Liste des clients</h2>
			<div className="flex justify-end">
				<Link
					className="px-4 py-1 text-blue-500 rounded-md bg-blue-100 hover:bg-blue-200 border shadow-sm hover:shadow"
					href="/admin/clients/create"
				>
					Ajouter
				</Link>
			</div>
			<div className="mt-4 overflow-x-auto shadow-sm">
				<table className="min-w-full text-gray-800 mt-4">
					<thead>
						<tr className="border bg-white text-gray-600 font-medium">
							<td className="pl-6 py-3 text-start pr-3">Nom</td>
							<td className="pl-6 py-3 text-start pr-3">Email</td>
							<td className="text-start pr-3">
								Adresse de facturation
							</td>
							<td className="text-start pr-3">Ajouté le</td>
							<td className="text-start pr-3">Actions</td>
						</tr>
					</thead>
					<tbody>
						{clients.map((client) => (
							<tr key={client.id} className="bg-white border">
								<td className="pl-6 py-4 pr-3">
									{client.name}
								</td>
								<td className="pl-6 py-4 pr-3">
									{client.email}
								</td>
								<td className="pl-6 py-4 pr-3">
									{client.billing_address}
								</td>
								<td className="pr-3">
									{formatDateTime(client.created_at)}
								</td>
								<td className="pr-3">
									<Link
										className="px-4 py-2 text-sm font-medium rounded-md focus:outline-none text-white bg-blue-500 hover:bg-blue-600 mr-3"
										href={`/admin/clients/${client.id}/edit`}
									>
										Modifier
									</Link>
									<Button
										text="Supprimer"
										onClick={() => handleDelete(client.id)}
										color="danger"
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
