import { getEncryptionToken, getDecryptToken } from "../utils/encrypt";
import { beforeAll, describe, expect, test } from "vitest";
import dotenv from "dotenv";

beforeAll(()=>{
    dotenv.config();
})


describe("Encryption and Decryption Tests", ()=>{

    test("should encrypt and decrypt a token correctly", async () => {
        const userId = 123;
        const plainToken = "my-secret-token";

        const encryptedToken = getEncryptionToken(userId, plainToken);

        expect(encryptedToken).not.toBeNull();

        if(encryptedToken !== null){
            const decryptedToken = getDecryptToken(encryptedToken, userId);
            expect(decryptedToken).toBe(plainToken);
        }
    });


    test("should throw an error for unsupported encryption key version", async () => {
        const userId = 123;
        const plainToken = "my-secret-token";

        const encryptedToken = getEncryptionToken(userId, plainToken);  

        if(encryptedToken !== null){
            // Manually change the version to an unsupported one
            const modifiedEncryptedToken = { ...encryptedToken, version: 999 };
            //그냥 에러 발생 여부만 알면 됨.
            expect(() => {
                getDecryptToken(modifiedEncryptedToken, userId);
            }).toThrow();
        }
    });


    test("환경 변수가 꺼져 있다면 에러 발생", async () => {
        const userId = 123;
        const plainToken = "my-secret-token";

        // 환경 변수를 제거
        const originalEncryptionKey = process.env.ENCRYPTION_KEY;
        delete process.env.ENCRYPTION_KEY;

        expect(() => {
            getEncryptionToken(userId, plainToken);
        }).toThrow();

        // 환경 변수 복원
        process.env.ENCRYPTION_KEY = originalEncryptionKey;
    }); 

});