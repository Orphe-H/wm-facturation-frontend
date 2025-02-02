import { create } from "zustand";
import { fetcher } from "@/lib/requestor";

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
		removeErrors: string[] | string | null;
		removeSuccess: boolean | null;
		addErrors: string[] | string | null;
		addSuccess: boolean | null;
		notification: { message: string; type: "success" | "error" } | null;
	}
>((set, get) => ({
	notification: null,
	product: null,
	products: [],
	fetchProducts: async () => {
		const response = await fetcher({ url: "/products" });
		const { success, data } = response;

		if (success && data) {
			set({ products: data as Product[] });
		}
	},
	fetchProduct: async (id: string) => {
		const response = await fetcher({
			url: `/products/${id}`,
		});
		const { success, data } = response;

		if (success && data) {
			set({ product: data as Product });
		}
	},
	addErrors: null,
	addSuccess: null,
	addProduct: async (product) => {
		set({ addErrors: null, addSuccess: null });

		const response = await fetcher({
			url: "/products",
			method: "POST",
			body: JSON.stringify(product),
		});

		const { success } = response;

		if (success) {
			set({
				addSuccess: true,
			});
		} else {
			set({
				addSuccess: false,
				addErrors: response.errors,
			});
		}

		setTimeout(() => set({ addErrors: null, addSuccess: null }), 2000);
	},
	updateProduct: async (id, product) => {
		const response = await fetcher({
			url: `/products/${id}`,
			method: "PATCH",
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
					message: response.errors?.join(", ") || "Erreur inconnue",
					type: "error",
				},
			});
		}

		setTimeout(() => set({ notification: null }), 2000);
	},
	removeErrors: null,
	removeSuccess: null,
	removeProduct: async (id: string) => {
		set({ removeErrors: null, removeSuccess: null });

		const response = await fetcher({
			url: `/products/${id}`,
			method: "DELETE",
		});

		const { success } = response;

		if (success) {
			set({
				removeSuccess: true,
			});

			await get().fetchProducts();
		} else {
			set({
				removeSuccess: false,
				removeErrors: response.errors,
			});
		}

		setTimeout(
			() => set({ removeErrors: null, removeSuccess: null }),
			2000
		);
	},
}));
