import { createContext } from "react";
import { MessagesContextType } from "../types";

export const MessagesContext = createContext<MessagesContextType | undefined>(undefined);
