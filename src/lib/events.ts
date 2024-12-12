import { nowInSeconds } from "@lawallet/react";
import { UnsignedEvent } from "nostr-tools";

export const buildBuyCreditsEvent = (
  userPubkey: string,
  creditsAmount: string
): UnsignedEvent => {
  return {
    kind: 21111,
    content: "",
    created_at: nowInSeconds(),
    pubkey: userPubkey,
    tags: [
      ["t", "buy-credits"],
      ["amount", creditsAmount],
    ],
  };
};
