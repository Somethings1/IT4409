import React from "react";

export function Badge({ children, variant = "default" }) {
  const variantClass = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-200 text-gray-600",
  }[variant] || "bg-gray-100 text-gray-800";

  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${variantClass}`}>
      {children}
    </span>
  );
}
