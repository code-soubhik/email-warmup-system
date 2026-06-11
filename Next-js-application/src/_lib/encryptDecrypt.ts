import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { UserThemePayload, UserSessionPayload } from '../_types/interfaces';

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

type AcceptedPayloadType = UserSessionPayload | UserThemePayload;

export async function encryptSession(payload: AcceptedPayloadType, expiresAt: Date): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresAt)
        .sign(encodedKey)
}

export async function decryptSession(session: string | undefined = ''): Promise<JWTPayload | undefined> {
    try {
        const { payload }: {payload: AcceptedPayloadType} = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload;
    } catch (error) {
        console.log('Failed to verify session')
    }
}
