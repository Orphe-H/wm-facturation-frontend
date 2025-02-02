import { create } from "zustand";
import { fetcher } from "@/lib/requestor";
import { ERROR_MESSAGES } from "@/lib/consts";
import { HTTP_METHOD } from "@/lib/enums";
import { Client } from "./client-store";
import { Product } from "./product-store";

export interface Invoice {
	id: string | null;
	reference: string;
	status: string | null;
	amount: number;
	client_id: string | null;
	client: {
		id: string;
		name: string;
	} | null;
	products: string[],
	created_at: string | null;
	paid_at: string | null;
}

interface InvoiceState {
	invoice: Invoice | null;
	invoices: Invoice[];
	clients: Client[];
	products: Product[];
	generatedFile: null;
	fetchInvoices: () => Promise<void>;
	fetchInvoice: (id: string) => Promise<void>;
	addInvoice: (invoice: Invoice) => void;
	createInvoice: () => Promise<void>;
	updateInvoice: (id: string, invoice: Invoice) => void;
	removeInvoice: (id: string) => void;
	payInvoice: (id: string) => void;
	generateInvoice: (id: string) => void;
	notification: { message: string; type: "success" | "error" } | null;
}

export const useInvoiceStore = create<
	InvoiceState & {
		notification: { message: string; type: "success" | "error" } | null;
	}
>((set, get) => ({
	notification: null,
	invoice: null,
	invoices: [],
	clients: [],
	products: [],
	generatedFile: null,
	fetchInvoices: async () => {
		const response = await fetcher({ url: "/invoices" });

		if (response.success && response.data) {
			set({ invoices: response.data as Invoice[] });
		}
	},
	fetchInvoice: async (id: string) => {
		const response = await fetcher({
			url: `/invoices/${id}`,
		});

		if (response.success && response.data) {
			set({ invoice: response.data as Invoice });
		}
	},
	createInvoice: async () => {
		const response = await fetcher({ url: "/invoices/create" });

		if (response.success && response.data) {
			set({
				clients: response.data.clients as Client[],
				products: response.data.products as Product[],
			});
		}
	},
	addInvoice: async (invoice) => {
		const response = await fetcher({
			url: "/invoices",
			method: HTTP_METHOD.POST,
			body: JSON.stringify(invoice),
		});

		if (response.success) {
			set({
				invoice: null,
				notification: {
					message: "Facture créée avec succès.",
					type: "success",
				},
			});
		} else {
			set({
				notification: {
					message:
						response.errors?.join(", ") || ERROR_MESSAGES.default,
					type: "error",
				},
			});
		}

		setTimeout(() => set({ notification: null }), 2000);
	},
	updateInvoice: async (id, invoice) => {
		const response = await fetcher({
			url: `/invoices/${id}`,
			method: HTTP_METHOD.PATCH,
			body: JSON.stringify(invoice),
		});

		if (response.success) {
			set({
				invoice: null,
				notification: {
					message: "Facture mise à jour avec succès",
					type: "success",
				},
			});
		} else {
			set({
				notification: {
					message:
						response.errors?.join(", ") || ERROR_MESSAGES.default,
					type: "error",
				},
			});
		}

		setTimeout(() => set({ notification: null }), 2000);
	},
	removeInvoice: async (id: string) => {
		const response = await fetcher({
			url: `/invoices/${id}`,
			method: HTTP_METHOD.DELETE,
		});

		if (response.success) {
			set({
				notification: {
					message: "Facture supprimée avec succès.",
					type: "success",
				},
			});

			await get().fetchInvoices();
		} else {
			set({
				notification: {
					message:
						response.errors?.join(", ") || ERROR_MESSAGES.default,
					type: "error",
				},
			});
		}

		setTimeout(() => set({ notification: null }), 2000);
	},
	payInvoice: async (id: string) => {
		const response = await fetcher({
			url: `/invoices/${id}/pay`,
			method: HTTP_METHOD.PATCH,
		});

		if (response.success) {
			set({
				notification: {
					message: "Facture payée avec succès.",
					type: "success",
				},
			});

			await get().fetchInvoices();
		} else {
			set({
				notification: {
					message:
						response.errors?.join(", ") || ERROR_MESSAGES.default,
					type: "error",
				},
			});
		}

		setTimeout(() => set({ notification: null }), 2000);
	},
	generateInvoice: async (id: string) => {
		const response = await fetcher({
			url: `/invoices/${id}/generate-file`,
		});

		if (response.success && response.data) {
			console.log(response.data);

			// TODO: set generated file
			set({ generatedFile: null });
		}
	},
}));
