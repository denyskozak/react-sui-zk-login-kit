const STORAGE_KEY = "ZKLoginState";

export const loadStateFromSession = <T>(initialZKLoginState: T): T => {
    const storedState = sessionStorage.getItem(STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : initialZKLoginState;
};

export const saveStateToSession = <T>(state: T) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};