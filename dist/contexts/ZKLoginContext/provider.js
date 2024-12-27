import { jsx as _jsx } from "react/jsx-runtime";
import { useReducer, useEffect } from "react";
import { initialZKLoginState } from "../../store/actions";
import { borrowInitState, zkLoginReducer } from "../../store/reducer";
import { saveStateToSession } from "../../store/session";
import { ZKLoginContext } from "./context";
export const ZKLoginProvider = ({ children, client }) => {
    const [state, dispatch] = useReducer(zkLoginReducer, initialZKLoginState, borrowInitState);
    // Save state to sessionStorage on every update
    useEffect(() => {
        saveStateToSession(state);
    }, [state]);
    return (_jsx(ZKLoginContext.Provider, { value: { state, dispatch, client }, children: children }));
};
