const STORAGE_KEY = "ZKLoginState";
export const loadStateFromSession = (initialZKLoginState) => {
    const storedState = sessionStorage.getItem(STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : initialZKLoginState;
};
export const saveStateToSession = (state) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
