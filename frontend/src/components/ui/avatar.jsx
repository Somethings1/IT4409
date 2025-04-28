import React from "react";

export function Avatar({ children }) {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-100">
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt }) {
  return <img className="h-full w-full object-cover" src={src} alt={alt} />;
}

export function AvatarFallback({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-500">
      {children}
    </div>
  );
}
