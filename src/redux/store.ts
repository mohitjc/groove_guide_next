import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import subscriptionReducer from "./slices/subscription";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import envirnment from "@/envirnment";
import { indexedDBStorage } from "@/utils/indexedDBStorage";

// 🔑 Use env variable for secret key
const PERSIST_SECRET = envirnment.secret_key as string;

if (!PERSIST_SECRET) {
  console.warn(
    "⚠️ Persist secret key is not set. Falling back to insecure default."
  );
}

// 🔒 Create encryptor transform
const encryptor = encryptTransform({
  secretKey: PERSIST_SECRET || "fallback-secret-dev-only",
  onError: (error) => {
    console.error("Persist encryption error:", error);
  },
});

const appName = envirnment.app_name;

const persistedUser = persistReducer(
  { key:`${appName}-user`, storage: indexedDBStorage, transforms: [encryptor] },
  userReducer
);

const persistedSubscription = persistReducer(
  { key: `${appName}-subscription`, storage: indexedDBStorage, transforms: [encryptor]},
  subscriptionReducer
);

// Combine reducers
const rootReducer = combineReducers({
  user: persistedUser,
  subscription: persistedSubscription,
});

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Types for TS
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
