import React from "react";

type ButtonProps = {
	text: string;
	onClick: () => void;
	color?: "primary" | "secondary" | "danger" | "success";
	variant?: "filled" | "outlined";
	className?: string;
};

const Button: React.FC<ButtonProps> = ({
	text,
	onClick,
	color = "primary",
	variant = "filled",
	className = "",
}) => {
	const baseStyles =
		"px-4 py-2 text-sm font-medium rounded-md focus:outline-none";
	const colorStyles = {
		primary: "text-white bg-blue-500 hover:bg-blue-600",
		secondary: "text-gray-700 bg-gray-200 hover:bg-gray-300",
		danger: "text-white bg-red-500 hover:bg-red-600",
		success: "text-white bg-green-500 hover:bg-green-600",
	};
	const variantStyles = {
		filled: "",
		outlined: "border-2 border-current bg-transparent",
	};

	return (
		<button
			onClick={onClick}
			className={`${baseStyles} ${colorStyles[color]} ${variantStyles[variant]} ${className}`}
		>
			{text}
		</button>
	);
};

export default Button;
