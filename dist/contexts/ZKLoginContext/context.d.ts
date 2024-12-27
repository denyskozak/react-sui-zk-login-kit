import { Dispatch } from "react";
import { SuiClient } from "@mysten/sui/client";
import { initialZKLoginState, ZKLoginAction } from "../../store/actions";
export interface ZKLoginContextValue {
    state: typeof initialZKLoginState;
    dispatch: Dispatch<ZKLoginAction>;
    client: SuiClient;
}
export declare const ZKLoginContext: import("react").Context<ZKLoginContextValue | undefined>;
