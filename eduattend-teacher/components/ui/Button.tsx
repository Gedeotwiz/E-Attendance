import { ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",

    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      {...props}
      className={`
        rounded-lg px-4 py-2
        text-sm font-medium
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}