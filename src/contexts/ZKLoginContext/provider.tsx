import {useReducer, PropsWithChildren, useEffect} from "react";
import {SuiClient} from "@mysten/sui/client";
import {initialZKLoginState} from "../../store/actions";
import {borrowInitState, zkLoginReducer} from "../../store/reducer";
import {saveStateToSession} from "../../store/session";
import {ZKLoginContext} from "./context";

interface Props {
    client: SuiClient;
}

export const ZKLoginProvider = ({children, client}: PropsWithChildren<Props>) => {
    const [state, dispatch] = useReducer(zkLoginReducer, initialZKLoginState, borrowInitState);

    // Save state to sessionStorage on every update
    useEffect(() => {
        saveStateToSession(state);
    }, [state]);

    return (
        <ZKLoginContext.Provider value={{state, dispatch, client}}>
            {children}
        </ZKLoginContext.Provider>
    );
};


