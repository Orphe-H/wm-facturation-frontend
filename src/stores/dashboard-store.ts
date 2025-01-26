import { fetcher } from "@/lib/requestor";
import { create } from "zustand";

interface Invoice {
	id: string;
	reference: string;
	status: string;
	amount: number;
	client: {
		id: string;
		name: string;
	} | null;
	created_at: string;
	paid_at: string | null;
}

interface DashboardState {
	stats: Record<string, number>;
	invoices: Array<Invoice>;
	fetchDashboardData: () => Promise<void>;
}

interface AllStatResponseData {
	stats: Record<string, number>;
	latest_invoices: Array<Invoice>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
	stats: {},
	invoices: [],
	fetchDashboardData: async () => {
		const response = await fetcher({
			url: "/stats/all",
		});

		const { success, data } = response;

		console.log(data);

		if (success && data) {
			const { stats, latest_invoices } = data as AllStatResponseData;

			set({ stats: stats, invoices: latest_invoices });
		} else {
			// return response, manage errors
		}
	},
}));
