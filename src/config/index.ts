import { del, get, set } from "idb-keyval";
import { createConfig, createStorage } from "@lawallet/react";

export const STORAGE_KEY: string = "user_secret_key";
export const NOSTWARD_ADMIN_KEY: string =
  "3f5a30545c6044c8ac445cd21b36921faf0c337e0ab59bde99e6cb864e971c68";

export const API_DEFAULT_URL: string = "https://api.lnbot.io";

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
