import {act, renderHook} from "@testing-library/react";
import type {PropsWithChildren} from "react";
import {describe, expect, it} from "vitest";
import type {ClientWithCoreApi} from "@mysten/sui/client";
import {ZKLoginProvider} from "../src/contexts";
import {useJwt, useLogout, useUserSalt} from "../src/hooks";
import {useZKLoginContext} from "../src/hooks/useZKLoginContext";

const client = {core: {}} as ClientWithCoreApi;
const wrapper = ({children}: PropsWithChildren) => (
    <ZKLoginProvider client={client}>{children}</ZKLoginProvider>
);

const createJwt = (payload: object) => {
    const encode = (value: object) => btoa(JSON.stringify(value))
        .replaceAll("+", "-")
        .replaceAll("/", "_")
        .replaceAll("=", "");

    return `${encode({alg: "none", typ: "JWT"})}.${encode(payload)}.`;
};

describe("context hooks", () => {
    it("throws a helpful error outside the provider", () => {
        expect(() => renderHook(() => useZKLoginContext())).toThrow(
            "useZKLoginContext must be used within a ZKLoginProvider",
        );
    });

    it("decodes and stores a valid JWT", () => {
        const {result} = renderHook(() => useJwt(), {wrapper});
        const jwt = createJwt({sub: "user-1", aud: "client-1", iss: "issuer"});

        act(() => result.current.setJwtString(jwt));

        expect(result.current.encodedJwt).toBe(jwt);
        expect(result.current.decodedJwt).toMatchObject({sub: "user-1", aud: "client-1"});
    });

    it("persists and clears the user salt", () => {
        const {result} = renderHook(() => useUserSalt(), {wrapper});

        act(() => result.current.setUserSalt("salt-1"));
        expect(result.current.userSalt).toBe("salt-1");
        expect(localStorage.getItem("userSalt")).toBe("salt-1");

        act(() => result.current.clearUserSalt());
        expect(result.current.userSalt).toBeNull();
        expect(localStorage.getItem("userSalt")).toBeNull();
    });

    it("clears in-memory authentication state on logout", () => {
        const {result} = renderHook(() => ({
            jwt: useJwt(),
            logout: useLogout().logout,
        }), {wrapper});

        act(() => result.current.jwt.setJwtString(createJwt({sub: "user-1"})));
        expect(result.current.jwt.encodedJwt).not.toBeNull();

        act(() => result.current.logout());
        expect(result.current.jwt.encodedJwt).toBeNull();
    });
});
