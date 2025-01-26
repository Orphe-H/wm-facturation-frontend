import { create } from "zustand";
import { fetcher } from "@/lib/requestor";

interface Product {
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
	}
>((set, get) => ({
	products: [],
	fetchProducts: async () => {
		const response = await fetcher({ url: "/products" });
		const { success, data } = response;

		if (success && data) {
			set({ products: data as Product[] });
		}
	},
	addProduct: (
		product // send store request
	) => set((state) => ({ products: [...state.products, product] })),
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
	},
}));
