import { ERROR_MESSAGES } from "@/lib/consts";
import { HTTP_METHOD } from "@/lib/enums";
import { fetcher } from "@/lib/requestor";
import { create } from "zustand";

export interface Client {
	id: string | null;
	name: string;
	email: string;
	billing_address: string;
	created_at: string | null;
}

interface ClientState {
	client: Client | null;
	clients: Client[];
	fetchClients: () => Promise<void>;
	fetchClient: (id: string) => Promise<void>;
	addClient: (client: Client) => void;
	updateClient: (id: string, client: Client) => void;
	removeClient: (id: string) => void;
	notification: { message: string; type: "success" | "error" } | null;
}

export const useClientStore = create<
	ClientState & {
		notification: { message: string; type: "success" | "error" } | null;
	}
>((set, get) => ({
	notification: null,
	client: null,
	clients: [],
	fetchClients: async () => {
		const response = await fetcher({ url: "/clients" });

		if (response.success && response.data) {
			set({ clients: response.data as Client[] });
		}
	},
	fetchClient: async (id: string) => {
		const response = await fetcher({
			url: `/clients/${id}`,
		});

		if (response.success && response.data) {
			set({ client: response.data as Client });
		}
	},
	addClient: async (client) => {
		const response = await fetcher({
			url: "/clients",
			method: HTTP_METHOD.POST,
			body: JSON.stringify(client),
		});

		if (response.success) {
			set({
				client: null,
				notification: {
					message: "Client créé avec succès.",
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
	updateClient: async (id: string, client) => {
		const response = await fetcher({
			url: `/clients/${id}`,
			method: HTTP_METHOD.PATCH,
			body: JSON.stringify(client),
		});

		if (response.success) {
			set({
				client: null,
				notification: {
					message: "Client mis à jour avec succès",
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
	removeClient: async (id: string) => {
		const response = await fetcher({
			url: `/clients/${id}`,
			method: HTTP_METHOD.DELETE,
		});

		if (response.success) {
			set({
				notification: {
					message: "Client supprimé avec succès.",
					type: "success",
				},
			});

			await get().fetchClients();
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
