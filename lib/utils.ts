import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: "USD" | "KRW" = "USD") {
    return new Intl.NumberFormat(currency === "USD" ? "en-US" : "ko-KR", {
        style: "currency",
        currency,
    }).format(value);
}
