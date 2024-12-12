import { API_DEFAULT_URL } from "@/config";
import { NostrEvent } from "@nostr-dev-kit/ndk";

export const buyCreditsRequest = async (event: NostrEvent) => {
  return fetch(`${API_DEFAULT_URL}/credits/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  })
    .then(async (res) => {
      const response = await res.json();
      if (!response.message) throw new Error();

      return response.message;
    })
    .catch(() => {
      return "";
    });
};
