import {describe, expect, it} from "vitest";
import {initialZKLoginState} from "../src/store/actions";
import {borrowInitState, zkLoginReducer} from "../src/store/reducer";
import {loadStateFromSession, saveStateToSession} from "../src/store/session";

describe("zkLoginReducer", () => {
    it("updates individual authentication fields without mutating the input", () => {
        const nextState = zkLoginReducer(initialZKLoginState, {
            type: "SET_USER_SALT",
            payload: "12345",
        });

        expect(nextState).not.toBe(initialZKLoginState);
        expect(nextState.userSalt).toBe("12345");
        expect(initialZKLoginState.userSalt).toBeNull();
    });

    it("resets all session fields", () => {
        const populated = {
            ...initialZKLoginState,
            jwtString: "jwt",
            userSalt: "salt",
            zkLoginAddress: "0x123",
        };

        expect(zkLoginReducer(populated, {type: "RESET"})).toEqual(initialZKLoginState);
    });
});

describe("session persistence", () => {
    it("round-trips state through sessionStorage", () => {
        const state = {...initialZKLoginState, nonce: "nonce"};

        saveStateToSession(state);

        expect(loadStateFromSession(initialZKLoginState)).toEqual(state);
    });

    it("hydrates the persisted session and prefers the durable user salt", () => {
        saveStateToSession({...initialZKLoginState, nonce: "nonce", userSalt: "session-salt"});
        localStorage.setItem("userSalt", "local-salt");

        expect(borrowInitState()).toMatchObject({nonce: "nonce", userSalt: "local-salt"});
    });
});
