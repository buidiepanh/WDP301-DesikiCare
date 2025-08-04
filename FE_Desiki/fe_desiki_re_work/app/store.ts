import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

// Import slices
import counterReducer from "../slices/counterSlice";
import userReducer from "../slices/userSlice";
import cartReducer from "../slices/cartSlice";

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer, // sẽ được persist
  counter: counterReducer, // không persist
  cart: cartReducer, // không persist
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // chỉ persist slice "user"
};

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // để redux-persist không bị warning
    }),
});

// Persistor export
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
