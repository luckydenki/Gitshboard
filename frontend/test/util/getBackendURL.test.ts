import getBackendURL from "~/utils/getBackendURL";
import { describe, it, expect, vi } from "vitest";



describe("getBackendURL", () => {

    it("should return the correct backend URL based on environment variables", () => {
        // 가짜 환경 변수를 설정합니다.
        vi.stubEnv("VITE_BACKEND_URL", "https://custom-backend.com");   
        vi.stubEnv("VITE_BACKEND_WHERE", "local");
        vi.stubEnv("VITE_BACKEND_LOCAL_URL", "http://localhost:3000");
        vi.stubEnv("VITE_BACKEND_PROD_URL", "https://prod-backend.com");


        // VITE_BACKEND_URL이 설정되어 있으면 해당 값을 반환해야 합니다.
        expect(getBackendURL()).toBe("https://custom-backend.com");
    })

    it("should return the local backend URL when VITE_BACKEND_URL is empty and VITE_BACKEND_WHERE is 'local'", () => {
        vi.stubEnv("VITE_BACKEND_URL", "");
        vi.stubEnv("VITE_BACKEND_WHERE", "local");
        vi.stubEnv("VITE_BACKEND_LOCAL_URL", "http://localhost:3000");
        vi.stubEnv("VITE_BACKEND_PROD_URL", "https://prod-backend.com");

        expect(getBackendURL()).toBe("http://localhost:3000");
    })
});




