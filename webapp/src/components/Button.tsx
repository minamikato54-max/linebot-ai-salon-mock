import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const baseClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-base font-medium transition-colors disabled:opacity-50";

const variantClass = {
  primary: "bg-rose-500 text-white hover:bg-rose-600",
  secondary: "bg-stone-200 text-stone-800 hover:bg-stone-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
} as const;

type Variant = keyof typeof variantClass;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${baseClass} ${variantClass[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
