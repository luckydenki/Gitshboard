import  { createContext } from "react";

export const DashboardContext = createContext<{
    reRender: boolean;
  setReRender: React.Dispatch<React.SetStateAction<boolean>>; 
} | null>(null);
