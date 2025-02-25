import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GlobalAlert } from "@/components/global-alert";

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

export const metadata: Metadata = {
	title: "Facturation APP",
	description: "Facturation APP",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body
				className={`antialiased bg-white text-black`}
				// className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Toaster richColors closeButton position="top-right" />

				<GlobalAlert />

				{children}
			</body>
		</html>
	);
}
