import { PropsWithChildren } from "react";
import { SuiClient } from "@mysten/sui/client";
interface Props {
    client: SuiClient;
}
export declare const ZKLoginProvider: ({ children, client }: PropsWithChildren<Props>) => import("react/jsx-runtime").JSX.Element;
export {};
