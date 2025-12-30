import envirnment from "@/envirnment";
import { openDB } from "idb";
import type { Storage } from "redux-persist";

const dbName = `${envirnment.app_name}DB`;
const storeName = `${envirnment.app_name}_Redux`;

async function getDB() {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is not available in this environment');
  }
  
  return openDB(dbName, 1, {
    upgrade(db) {
      db.createObjectStore(storeName);
    },
  });
}

export const indexedDBStorage: Storage = {
  async getItem(key) {
    try {
      if (typeof window === 'undefined') return null;
      return (await getDB()).get(storeName, key);
    } catch (error) {
      console.error('Error getting item from IndexedDB:', error);
      return null;
    }
  },
  async setItem(key, value) {
    try {
      if (typeof window === 'undefined') return;
      return (await getDB()).put(storeName, value, key);
    } catch (error) {
      console.error('Error storing data:', error);
      return;
    }
  },
  async removeItem(key) {
    try {
      if (typeof window === 'undefined') return;
      return (await getDB()).delete(storeName, key);
    } catch (error) {
      console.error('Error removing item from IndexedDB:', error);
      return;
    }
  },
};