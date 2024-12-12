import { del, get, set } from "idb-keyval";
import { createConfig, createStorage } from "@lawallet/react";

export const STORAGE_KEY = "user_secret_key";

const storage = createStorage({
  storage: {
    async getItem(name) {
      return get(name);
    },
    async setItem(name, value) {
      await set(name, value);
    },
    async removeItem(name) {
      await del(name);
    },
  },
});

export const config = createConfig({
  relaysList: [
    "wss://relay.hodl.ar",
    "wss://relay.lawallet.ar",
    "wss://relay.damus.io",
  ],
  storage,
});
