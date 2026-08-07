import { createCipheriv, createDecipheriv, randomBytes } from "crypto";




const ALGORITHM = "aes-256-gcm";
const AUTH_TAG_LENGTH = 16;
const CURRENT_KEY_VERSION = 1;
const IV_LENGTH = 12;

export interface EncryptedToken {
    version: number;
    ciphertext: string;
    iv: string;
    authTag: string;
}


export const getEncryptionKey = (): Buffer => {
    const encodedKey = process.env.ENCRYPTION_KEY;

    if (!encodedKey) {
        throw new Error(
            "ENCRYPTION_KEY 환경변수가 설정되지 않았습니다.",
        );
    }

    const key = Buffer.from(encodedKey, "base64");

    if (key.length !== 32) {
        throw new Error(
            "ENCRYPTION_KEY는 Base64로 인코딩된 32바이트 키여야 합니다.",
        );
    }

    return key;
}


export const getEncryptionToken = (userId : number, plainToken : string) : EncryptedToken | null => {
        const key = getEncryptionKey();
        const iv = randomBytes(IV_LENGTH);


        const cipher = createCipheriv(ALGORITHM, key, iv, {
            authTagLength: AUTH_TAG_LENGTH,
        });

        /*
            * AAD(Additional Authenticated Data)
            *
            * 암호문을 특정 사용자와 묶습니다.
            * 다른 사용자의 암호문으로 바꿔치기하면 복호화 검증에 실패합니다.
            */
        cipher.setAAD(
            Buffer.from(`github-access-token:user:${userId}:v${CURRENT_KEY_VERSION}`),
        );
        const ciphertext = Buffer.concat([
            cipher.update(plainToken, "utf8"),
            cipher.final(),
        ]);
        const authTag = cipher.getAuthTag();

        return {
            version: CURRENT_KEY_VERSION,
            ciphertext: ciphertext.toString("base64"),
            iv: iv.toString("base64"),
            authTag: authTag.toString("base64"),
        }
    }




export const  getDecryptToken = ( encrypted: EncryptedToken, userId: string | number): string =>{
    if (encrypted.version !== CURRENT_KEY_VERSION) {
        throw new Error(
            `지원하지 않는 암호화 키 버전입니다: ${encrypted.version}`,
        );
    }

    const key = getEncryptionKey();

    const decipher = createDecipheriv(
        ALGORITHM,
        key,
        Buffer.from(encrypted.iv, "base64"),
        {
            authTagLength: AUTH_TAG_LENGTH,
        },
    );

    decipher.setAAD(
        Buffer.from(`github-access-token:user:${userId}:v${encrypted.version}`),
    );

    decipher.setAuthTag(Buffer.from(encrypted.authTag, "base64"));

    try {
        const plaintext = Buffer.concat([
            decipher.update(
                Buffer.from(encrypted.ciphertext, "base64"),
            ),
            decipher.final(),
        ]);

        return plaintext.toString("utf8");
    } catch {
        throw new Error(
            "GitHub 토큰 복호화에 실패했습니다. 키 또는 암호화 데이터가 올바르지 않습니다.",
        );
    }
}