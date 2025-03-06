const STORAGE_KEY = "ZKLoginState";

export const loadStateFromSession = <T>(initialZKLoginState: T): T => {
    if (typeof window !== "undefined") {
        const storedState = sessionStorage.getItem(STORAGE_KEY);
        return storedState ? JSON.parse(storedState) : initialZKLoginState;
    }
    return initialZKLoginState;
};

export const saveStateToSession = <T>(state: T) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
};