import {ZKLoginState, ZKLoginAction, initialZKLoginState} from "./actions";
import {loadStateFromSession} from "./session";

export const zkLoginReducer = (state: ZKLoginState, action: ZKLoginAction): ZKLoginState => {
    switch (action.type) {
        case "SET_EPHEMERAL_KEY_PAIR":
            return {...state, ephemeralKeySecret: action.payload};
        case "SET_RANDOMNESS":
            return {...state, randomness: action.payload};
        case "SET_NONCE":
            return {...state, nonce: action.payload};
        case "SET_JWT":
            return {...state, jwtString: action.payload.jwtString, decodedJwt: action.payload.decodedJwt};
        case "SET_USER_SALT":
            return {...state, userSalt: action.payload};
        case "DELETE_USER_SALT":
            return {...state, userSalt: null};
        case "SET_ZK_LOGIN_ADDRESS":
            return {...state, zkLoginAddress: action.payload};
        case "SET_ZK_PROOF":
            return {...state, zkProof: action.payload};
        case "SET_TRANSACTION_DIGEST":
            return {...state, transactionDigest: action.payload};
        case "RESET":
            return {...initialZKLoginState};
        default:
            return {...state};
    }
};

export const borrowInitState = () => {
    const sessionState = loadStateFromSession(initialZKLoginState);
    return {...sessionState, userSalt: localStorage.getItem("userSalt") };
}