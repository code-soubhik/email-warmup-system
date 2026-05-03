import 'server-only'
import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME } from '@/constant'
import { decryptSession, encryptSession } from './encryptDecrypt'
import { cache } from 'react'
import { UserSessionInterface, UserSessionPayload } from '@/types/interfaces'

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
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  const payload = await decryptSession(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decryptSession(cookie);

  const data = { isAuth: true, userId: session?.userId } as UserSessionInterface;

  if (!session?.userId) {
    data.isAuth = false;
    data.userId = null;
  }

  return data;
})