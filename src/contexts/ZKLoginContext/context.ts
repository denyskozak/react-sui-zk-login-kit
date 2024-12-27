import {createContext, Dispatch} from "react";
import {SuiClient} from "@mysten/sui/client";
import {initialZKLoginState, ZKLoginAction} from "../../store/actions";

export interface ZKLoginContextValue {
    state: typeof initialZKLoginState;
    dispatch: Dispatch<ZKLoginAction>;
    client: SuiClient;
}

export const ZKLoginContext = createContext<ZKLoginContextValue | undefined>(undefined);