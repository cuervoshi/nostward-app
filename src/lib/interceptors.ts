import { NostrEvent } from "@nostr-dev-kit/ndk";

export const buyCreditsRequest = async (event: NostrEvent) => {
  return fetch("http://147.79.83.24:3000/credits/request", {
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
