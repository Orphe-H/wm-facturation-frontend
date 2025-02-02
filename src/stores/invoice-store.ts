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
	client:
		| {
				id: string;
				name: string;
		  }
		| Client
		| null;
	products: { product_id: string; quantity: string }[];
	created_at: string | null;
	paid_at: string | null;
}

interface InvoiceState {
	invoice: Invoice | null;
	invoices: Invoice[];
	clients: Client[];
	products: Product[];
	generatedFile: string | null;
	fetchInvoices: () => Promise<void>;
	fetchInvoice: (id: string) => Promise<void>;
	addInvoice: (invoice: Invoice) => void;
	payInvoice: (id: string) => void;
	generateInvoice: (id: string) => void;
	notification: { message: string; type: "success" | "error" } | null;
	generationPending: boolean;
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
	generationPending: false,
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
		set({ generatedFile: null, generationPending: true });
		setTimeout(() => set({ generationPending: false }), 500);

		const response = await fetcher({
			url: `/invoices/${id}/generate-file`,
			method: HTTP_METHOD.GET,
			customAcceptHeader: "application/pdf",
		});

		if (response.success && response.data) {
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `invoice_${id}.pdf`);
			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			set({ generatedFile: url });
		} else {
			set({
				notification: {
					message:
						response.errors?.join(", ") || ERROR_MESSAGES.default,
					type: "error",
				},
			});
		}
	},
}));
