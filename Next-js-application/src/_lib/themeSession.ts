import 'server-only'
import { cookies } from 'next/headers'
import { THEME_COOKIE_NAME } from '@/_utils/constant';


export async function setTheme(themeValue: "dark" | "light") {
    const cookieStore = await cookies();
    cookieStore.set(THEME_COOKIE_NAME, themeValue, {
        sameSite: 'lax',
        path: '/',
    })
}

export async function getTheme() {
    const cookieStore = await cookies();
    const themeCookie = cookieStore.get(THEME_COOKIE_NAME)?.value;
    if (!themeCookie) {
        cookieStore.set(THEME_COOKIE_NAME, "dark");
    }
    return cookieStore.get(THEME_COOKIE_NAME)?.value;
}
