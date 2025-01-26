import { create } from "zustand";

interface AlertState {
	message: string | null;
	type: "success" | "error" | "info" | "warning" | null;
	setAlert: (
		message: string,
		type: "success" | "error" | "info" | "warning"
	) => void;
	clearAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
	message: null,
	type: null,
	setAlert: (message, type) => set({ message, type }),
	clearAlert: () => set({ message: null, type: null }),
}));
