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

export const useProductStore = create<ProductState>((set) => ({
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
	removeProduct: (
		id // send remove request
	) =>
		set((state) => ({
			products: state.products.filter((p) => p.id !== id),
		})),
}));
