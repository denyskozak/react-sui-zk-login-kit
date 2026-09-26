import {describe, expect, it} from "vitest";
import {getTokenFromUrl} from "../src/utilities";

describe("getTokenFromUrl", () => {
    it("extracts the encoded id token from the URL hash", () => {
        window.history.replaceState({}, "", "/callback#state=oauth-state&id_token=header.payload.signature");

        expect(getTokenFromUrl()).toBe("header.payload.signature");
    });

    it("returns null when the hash has no id token", () => {
        window.history.replaceState({}, "", "/callback#state=oauth-state");

        expect(getTokenFromUrl()).toBeNull();
    });
});
