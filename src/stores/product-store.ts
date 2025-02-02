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
}

export const useProductStore = create<
	ProductState & {
		removeErrors: string[] | string | null;
		removeSuccess: boolean | null;
		addErrors: string[] | string | null;
		addSuccess: boolean | null;
		updateErrors: string[] | string | null;
		updateSuccess: boolean | null;
	}
>((set, get) => ({
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

		setTimeout(() => set({ addErrors: null, addSuccess: null }), 1000);
	},
	updateErrors: null,
	updateSuccess: null,
	updateProduct: async (id: string, product: Partial<Product>) => {
		const response = await fetcher({
			url: `/products/${id}`,
			method: "PATCH",
			body: JSON.stringify(product),
		});

		const { success } = response;

		if (success) {
			set({
				product: null,
				updateSuccess: true,
			});
		} else {
			set({
				updateSuccess: false,
				updateErrors: response.errors,
			});
		}

		setTimeout(
			() => set({ updateErrors: null, updateSuccess: null }),
			1000
		);
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
			1000
		);
	},
}));
