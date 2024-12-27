import { useContext } from "react";
import { ZKLoginContext } from "../contexts";
export const useZKLoginContext = () => {
    const context = useContext(ZKLoginContext);
    if (!context) {
        throw new Error("useZKLoginContext must be used within a ZKLoginProvider");
    }
    return context;
};
