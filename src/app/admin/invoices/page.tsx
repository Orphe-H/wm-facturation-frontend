"use client";

import Button from "@/components/button";
import { formatDateTime, getStatusLabel } from "@/lib/helpers";
import { useAlertStore } from "@/stores/alert-store";
import { useInvoiceStore } from "@/stores/invoice-store";
import Link from "next/link";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function InvoicesPage() {
	const {
		notification,
		invoices,
		fetchInvoices,
		payInvoice,
		generateInvoice,
		generationPending,
	} = useInvoiceStore();
	const setAlert = useAlertStore((state) => state.setAlert);

	useEffect(() => {
		fetchInvoices();
	}, [fetchInvoices]);

	const handlePay = (id: string | null) => {
		if (id) {
			Swal.fire({
				title: "Êtes-vous sûr ?",
				text: "Vous ne pourrez pas annuler cette action !",
				icon: "warning",
				confirmButtonColor: "green",
				confirmButtonText: "Oui payer !",
				showCancelButton: true,
				cancelButtonText: "Annuler",
				cancelButtonColor: "#3085d6",
			}).then((result) => {
				if (result.isConfirmed) {
					payInvoice(id);
				}
			});
		}
	};

	const handleGenerate = (id: string | null) => {
		if (id) {
			generateInvoice(id);
		}
	};

	useEffect(() => {
		if (notification) {
			setAlert(notification.message, notification.type);
		}
	}, [notification, setAlert]);

	useEffect(() => {
		if (generationPending === true) {
			setAlert(
				"Génération de facture en cours, veuillez patienter.",
				"success"
			);
		}
	}, [generationPending, setAlert]);

	return (
		<div>
			<h2 className="font-medium text-lg">Liste des factures</h2>
			<div className="flex justify-end">
				<Link
					className="px-4 py-1 text-blue-500 rounded-md bg-blue-100 hover:bg-blue-200 border shadow-sm hover:shadow"
					href="/admin/invoices/create"
				>
					Ajouter
				</Link>
			</div>
			<div className="mt-4 overflow-x-auto shadow-sm">
				<table className="min-w-full text-gray-800 mt-4">
					<thead>
						<tr className="border bg-white text-gray-600 font-medium">
							<td className="pl-6 py-3 text-start pr-3">
								Référence
							</td>
							<td className="text-start pr-3">Client</td>
							<td className="text-start pr-3">Statut</td>
							<td className="text-start pr-3">Montant</td>
							<td className="text-start pr-3">Créé le</td>
							<td className="text-start pr-3">Payé le</td>
							<td className="text-start pr-3">Actions</td>
						</tr>
					</thead>
					<tbody>
						{invoices.map((invoice) => (
							<tr key={invoice.id} className="bg-white border">
								<td className="pl-6 py-4 pr-3">
									{invoice.reference}
								</td>
								<td className="pr-3">{invoice.client?.name}</td>
								<td className="pr-3">
									<div
										className={`w-3/5 rounded-xl px-2 py-1 uppercase text-center text-sm font-medium ${
											invoice.status === "paid"
												? "text-green-700 bg-green-100"
												: "text-red-700 bg-red-100"
										}`}
									>
										{getStatusLabel(invoice.status)}
									</div>
								</td>
								<td className="pr-3">{invoice.amount} FCFA</td>
								<td className="pr-3">
									{formatDateTime(invoice.created_at)}
								</td>
								<td className="pr-3">
									{formatDateTime(invoice.paid_at)}
								</td>
								<td className="pr-3">
									{invoice.status !== "paid" && (
										<Button
											text="Payer"
											onClick={() =>
												handlePay(invoice.id)
											}
											color="success"
											className="w-36"
										/>
									)}

									{invoice.status == "paid" && (
										<Button
											text="Générer facture"
											onClick={() =>
												handleGenerate(invoice.id)
											}
											color="primary"
											className="w-36"
										/>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
