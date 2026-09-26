import "@testing-library/jest-dom/vitest";
import {afterEach} from "vitest";

afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.history.replaceState({}, "", "/");
});
