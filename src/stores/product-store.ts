import { create } from "zustand";
import { fetcher } from "@/lib/requestor";

export interface Product {
	id: string | null;
	name: string;
	price: number;
	created_at: string | null;
}

interface ProductState {
	products: Product[];
	fetchProducts: () => Promise<void>;
	addProduct: (product: Product) => void;
	updateProduct: (product: Product) => void;
	removeProduct: (id: string) => void;
}

export const useProductStore = create<
	ProductState & {
		removeErrors: string[] | string | null;
		removeSuccess: boolean | null;
		addErrors: string[] | string | null;
		addSuccess: boolean | null;
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
	updateProduct: (
		product // send update request
	) =>
		set((state) => ({
			products: state.products.map((p) =>
				p.id === product.id ? { ...p, ...product } : p
			),
		})),
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

		setTimeout(() => set({ removeErrors: null, removeSuccess: null }), 1000);
	},
}));
