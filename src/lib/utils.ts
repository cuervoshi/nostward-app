import { NDKFilter } from "@nostr-dev-kit/ndk";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copy = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.log("Failed to copy: ", error);
    return false;
  }
};

export function validateNDKFilter(filter: NDKFilter): NDKFilter {
  for (const key in filter) {
    const value = filter[key as keyof NDKFilter];

    // Verifica si es un arreglo y tiene longitud 0
    if (Array.isArray(value) && value.length === 0) {
      filter[key as keyof NDKFilter] = undefined;
    } else {
      if (key === "since" || key === "until" || key === "limit") {
        if (typeof value === "string" || typeof value === "number") {
          (filter[key as keyof NDKFilter] as number | undefined) = parseInt(
            value.toString(),
            10
          );
        }
      } else if (key === "kinds") {
        if (Array.isArray(value)) {
          (filter[key as keyof NDKFilter] as number[] | undefined) = value.map(
            (val) =>
              typeof val === "number" ? val : parseInt(val.toString(), 10)
          );
        }
      }
    }
  }

  return filter;
}
