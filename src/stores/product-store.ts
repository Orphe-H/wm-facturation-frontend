import { create } from "zustand";
import { fetcher } from "@/lib/requestor";
import { ERROR_MESSAGES } from "@/lib/consts";
import { HTTP_METHOD } from "@/lib/enums";

export interface Product {
	id: string | null;
	name: string;
	price: number;
	created_at: string | null;
}

interface ProductState {
	product: Product | null;
	products: Product[];
	fetchProducts: () => Promise<void>;
	fetchProduct: (id: string) => Promise<void>;
	addProduct: (product: Product) => void;
	updateProduct: (id: string, product: Product) => void;
	removeProduct: (id: string) => void;
	notification: { message: string; type: "success" | "error" } | null;
}

export const useProductStore = create<
	ProductState & {
		notification: { message: string; type: "success" | "error" } | null;
	}
>((set, get) => ({
	notification: null,
	product: null,
	products: [],
	fetchProducts: async () => {
		const response = await fetcher({ url: "/products" });

		if (response.success && response.data) {
			set({ products: response.data as Product[] });
		}
	},
	fetchProduct: async (id: string) => {
		const response = await fetcher({
			url: `/products/${id}`,
		});

		if (response.success && response.data) {
			set({ product: response.data as Product });
		}
	},
	addProduct: async (product) => {
		const response = await fetcher({
			url: "/products",
			method: HTTP_METHOD.POST,
			body: JSON.stringify(product),
		});

		if (response.success) {
			set({
				product: null,
				notification: {
					message: "Produit créé avec succès.",
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
	updateProduct: async (id, product) => {
		const response = await fetcher({
			url: `/products/${id}`,
			method: HTTP_METHOD.PATCH,
			body: JSON.stringify(product),
		});

		if (response.success) {
			set({
				product: null,
				notification: {
					message: "Produit mis à jour avec succès",
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
	removeProduct: async (id: string) => {
		const response = await fetcher({
			url: `/products/${id}`,
			method: HTTP_METHOD.DELETE,
		});

		if (response.success) {
			set({
				notification: {
					message: "Produit supprimé avec succès.",
					type: "success",
				},
			});

			await get().fetchProducts();
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
}));
