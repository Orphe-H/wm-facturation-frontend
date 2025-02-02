"use client";

import { useAlertStore } from "@/stores/alert-store";
import { useClientStore } from "@/stores/client-store";
import { Invoice, useInvoiceStore } from "@/stores/invoice-store";
import { useProductStore } from "@/stores/product-store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateInvoicePage() {
	const router = useRouter();
	const setAlert = useAlertStore((state) => state.setAlert);
	const { addInvoice, notification } = useInvoiceStore();

	const { fetchProducts, products } = useProductStore();
	const { fetchClients, clients } = useClientStore();

	const [pending, setPending] = useState(false);
	const [invoice, setInvoice] = useState<Invoice>({
		id: null,
		reference: "",
		status: null,
		amount: 0,
		client_id: "",
		client: null,
		products: [],
		created_at: null,
		paid_at: null,
	});

	const [selectedProducts, setSelectedProducts] = useState<{
		[key: string]: number;
	}>({});

	useEffect(() => {
		fetchProducts();
		fetchClients();
	}, [fetchProducts, fetchClients]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setInvoice((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleProductChange = (productId: string, quantity: number) => {
		setSelectedProducts((prev) => ({
			...prev,
			[productId]: quantity,
		}));
	};

	const calculateTotalAmount = () => {
		let total = 0;
		for (const productId in selectedProducts) {
			const product = products.find((p) => p.id === productId);
			if (product) {
				total += product.price * selectedProducts[productId];
			}
		}
		setInvoice((prev) => ({
			...prev,
			amount: total,
		}));
	};

	useEffect(() => {
		calculateTotalAmount();
	}, [selectedProducts]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!invoice.client_id || Object.keys(selectedProducts).length === 0) {
			setAlert(
				"Veuillez sélectionner un client et au moins un produit avec une quantité.",
				"error"
			);
			return;
		}

		const invoiceProducts = Object.entries(selectedProducts).map(
			([productId, quantity]) => ({
				product_id: productId,
				quantity: String(quantity),
			})
		);
		const invoiceData: Invoice = {
			id: null, 
			reference: "", 
			status: null, 
			amount: invoice.amount,
			client_id: invoice.client_id,
			client: null,
			products: invoiceProducts,
			created_at: null, 
			paid_at: null,
		};

		setPending(true);
		await addInvoice(invoiceData);
		setPending(false);
	};

	useEffect(() => {
		if (notification) {
			if (notification.type === "success") {
				router.push("/admin/invoices");
			} else {
				setAlert(notification.message, notification.type);
			}
		}
	}, [notification, router, setAlert]);

	return (
		<div>
			<h2 className="font-medium text-lg">Ajouter une facture</h2>
			<div className="mt-4">
				<Link
					className="px-4 py-1 rounded-md bg-gray-700 hover:bg-gray-800 text-white"
					href="/admin/invoices"
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
									htmlFor="client_id"
									className="block font-medium text-gray-700"
								>
									Client
								</label>
								<select
									name="client_id"
									id="client_id"
									required
									value={invoice.client_id ?? ""}
									onChange={handleChange}
									className="w-full mt-1 py-2 px-2.5 bg-transparent ring-1 ring-gray-300 border-0 rounded"
								>
									<option value="">
										Sélectionner un client
									</option>
									{Array.isArray(clients) &&
										clients.map((client) => (
											<option
												key={client.id}
												value={client.id ?? ""}
											>
												{client.name}
											</option>
										))}
								</select>
							</div>
							<div className="mt-4">
								<label className="block font-medium text-gray-700">
									Produits
								</label>
								{Array.isArray(products) &&
									products.map((product) => (
										<div
											key={product.id}
											className="flex items-center space-x-4 mt-2"
										>
											<input
												type="checkbox"
												value={product.id ?? ""}
												onChange={(e) => {
													const productId =
														e.target.value;
													if (e.target.checked) {
														handleProductChange(
															productId,
															1
														);
													} else {
														setSelectedProducts(
															(prev) => {
																const updated =
																	{ ...prev };
																delete updated[
																	productId
																];
																return updated;
															}
														);
													}
												}}
											/>
											<span>
												{product.name} ({product.price}{" "}
												fcfa)
											</span>
											{selectedProducts[
												product.id ?? ""
											] !== undefined && (
												<input
													type="number"
													min={1}
													value={
														selectedProducts[
															product.id ?? ""
														]
													}
													onChange={(e) =>
														handleProductChange(
															product.id ?? "",
															Number(
																e.target.value
															)
														)
													}
													className="w-20 px-2 py-1 bg-transparent ring-1 ring-gray-300 border-0 rounded"
												/>
											)}
										</div>
									))}
							</div>
							<div className="mt-4">
								<label
									htmlFor="amount"
									className="block font-medium text-gray-700"
								>
									Montant total
								</label>
								<input
									type="number"
									min={1}
									required
									name="amount"
									value={invoice.amount}
									readOnly
									className="w-full mt-1 py-2 px-2.5 bg-gray-200 ring-1 ring-gray-300 border-0 rounded"
								/>
							</div>
							<div className="mt-8 flex justify-end">
								<button
									type="submit"
									disabled={pending}
									className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
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
