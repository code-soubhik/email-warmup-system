import 'server-only'
import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME } from '@/utils/constant'
import { decryptSession, encryptSession } from './encryptDecrypt'
import { cache } from 'react'
import { UserSessionInterface } from '@/types/interfaces'

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const session = await encryptSession({ userId, expiresAt })

  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function updateSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) return null;

  const payload = await decryptSession(sessionToken);

  if (!payload?.userId) return null;

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 🔥 re-encrypt with new expiry
  const newSession = await encryptSession({ userId: payload?.userId as string, expiresAt })

  cookieStore.set(SESSION_COOKIE_NAME, newSession, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export const verifySession = cache(async (): Promise<UserSessionInterface> => {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(SESSION_COOKIE_NAME)?.value
  const data: UserSessionInterface = {
    userId: null,
    isAuth: false
  }

  if (!cookie) return data;

  const session = await decryptSession(cookie)

  const isValid = 
    session?.userId &&
    session?.exp &&
    new Date(session.exp) > new Date()

  if (!isValid) {
    return data;
  }

  return {
    isAuth: true,
    userId: session.userId as string,
    subscription: "free"
  }
})