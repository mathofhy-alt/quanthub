
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | undefined | null, currency: "USD" | "KRW" = "USD") {
    // Safety check: if value is missing or not a number, return $0.00
    if (value === undefined || value === null || isNaN(value)) {
        return currency === "USD" ? "$0.00" : "0원";
    }

    try {
        return new Intl.NumberFormat(currency === "USD" ? "en-US" : "ko-KR", {
            style: "currency",
            currency,
        }).format(value);
    } catch (e) {
        // Fallback in case of weird locale errors
        return currency === "USD" ? `$${value}` : `${value}원`;
    }
}
