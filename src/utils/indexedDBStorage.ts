import envirnment from "@/envirnment";
import { openDB } from "idb";
import type { Storage } from "redux-persist";

const dbName = `${envirnment.app_name}DB`;
const storeName = `${envirnment.app_name}_Redux`;

async function getDB() {
  return openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName);
    },
  });
}

export const indexedDBStorage: Storage = {
  async getItem(key) {
    return (await getDB()).get(storeName, key);
  },
  async setItem(key, value) {
    return (await getDB()).put(storeName, value, key);
  },
  async removeItem(key) {
    return (await getDB()).delete(storeName, key);
  },
};
