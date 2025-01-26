"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
	href: string;
	children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
	const currentPath = usePathname();

	const isActive = currentPath.startsWith(href);

	const linkClass = `block py-2 px-4 rounded hover:bg-gray-200 ${
		isActive
			? "bg-blue-100 hover:bg-blue-200 text-blue-700"
			: "hover:bg-gray-200 text-gray-800"
	}`;

	return (
		<Link href={href} className={linkClass}>
			{children}
		</Link>
	);
}
