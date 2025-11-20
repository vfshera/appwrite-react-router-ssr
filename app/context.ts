import type { Models } from "node-appwrite";
import { createContext } from "react-router";

export const userContext = createContext<Models.User | null>(null);
