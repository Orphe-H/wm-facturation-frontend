"use client";

import { formatDateTime, getStatusLabel } from "@/lib/helpers";
import { ERROR_MESSAGES } from "@/lib/consts";
import { useAlertStore } from "@/stores/alert-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useEffect } from "react";

export default function DashboardPage() {
	const { stats, invoices, fetchDashboardData, errors, isLoading } =
		useDashboardStore();
	const setAlert = useAlertStore((state) => state.setAlert);

	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-32">
				<span className="text-gray-600">Chargement des données...</span>
			</div>
		);
	}

	if (errors) {
		if (Array.isArray(errors)) {
			errors.forEach((error) => {
				setAlert(error, "error");
			});
		} else if (errors) {
			setAlert(errors, "error");
		} else {
			setAlert(ERROR_MESSAGES.default, "error");
		}
	}

	if (!isLoading) {
		return (
			<div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<div className="rounded-lg bg-white shadow hover:shadow-lg hover:-mx-0.5 px-6 py-3 border">
						<div className="text-sm">Total des ventes</div>
						<div className="space-x-1">
							<span className="text-3xl font-medium">
								{stats.total_sell}
							</span>
							<span>FCFA</span>
						</div>
					</div>
					<div className="rounded-lg bg-green-50 text-green-700 shadow hover:shadow-lg hover:-mx-0.5 px-6 py-3 border">
						<div className="text-sm">Total des ventes payés</div>
						<div className="space-x-1">
							<span className="text-3xl font-medium">
								{stats.total_paid_sell}
							</span>
							<span>FCFA</span>
						</div>
					</div>
					<div className="rounded-lg bg-red-50 text-red-700 shadow hover:shadow-lg hover:-mx-0.5 px-6 py-3 border">
						<div className="text-sm">
							Total des ventes en attente
						</div>
						<div className="space-x-1">
							<span className="text-3xl font-medium">
								{stats.total_pending_sell}
							</span>
							<span>FCFA</span>
						</div>
					</div>
				</div>

				<div className="mt-10">
					<h2 className="font-medium text-lg">Dernières factures</h2>
					<div className="mt-4 overflow-x-auto shadow-sm">
						<table className="min-w-full text-gray-800">
							<thead>
								<tr className="border bg-white text-gray-600 font-medium">
									<td className="pl-6 py-3 text-start pr-3">
										Référence
									</td>
									<td className="text-start pr-3">Statut</td>
									<td className="text-start pr-3">Montant</td>
									<td className="text-start pr-3">Client</td>
									<td className="text-start pr-3">Créé le</td>
									<td className="text-start pr-3">Payé le</td>
								</tr>
							</thead>
							<tbody>
								{invoices.length > 0 ? (
									invoices.map((invoice) => (
										<tr
											key={invoice.id}
											className="bg-white border"
										>
											<td className="pl-6 py-4 pr-3">
												{invoice.reference}
											</td>
											<td className="pr-3">
												<div
													className={`w-3/5 rounded-xl px-2 py-1 uppercase text-center text-sm font-medium ${
														invoice.status ===
														"paid"
															? "text-green-700 bg-green-100"
															: "text-red-700 bg-red-100"
													}`}
												>
													{getStatusLabel(
														invoice.status
													)}
												</div>
											</td>
											<td className="pr-3">
												{invoice.amount} FCFA
											</td>
											<td className="pr-3">
												{invoice.client?.name}
											</td>
											<td className="pr-3">
												{formatDateTime(invoice.created_at)}
											</td>
											<td className="pr-3">
												{formatDateTime(invoice.paid_at)}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={6}>
											<div className="flex items-center justify-center mt-1">
												<span className="text-gray-700 text-sm">
													Créez un nouvel élément pour
													commencer.
												</span>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		);
	}
}
