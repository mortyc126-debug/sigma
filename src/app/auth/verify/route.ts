import { type NextRequest, NextResponse } from "next/server";

/**
 * Чистый прокси-редирект для magic link писем.
 *
 * NextAuth генерирует ссылку вида:
 *   /api/auth/callback/email?callbackUrl=...&token=LONG_TOKEN
 *
 * Такой URL триггерит Google Safe Browsing (два токена + /api/auth/callback/email).
 * Вместо него в письмо вставляем:
 *   /auth/verify?t=NEXTAUTH_TOKEN&r=CALLBACK_URL
 *
 * Этот роут принимает параметры и делает серверный редирект на NextAuth callback.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const token = searchParams.get("t");
  const callbackUrl = searchParams.get("r") ?? "/dashboard";

  if (!token) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const nextAuthCallback = new URL("/api/auth/callback/email", origin);
  nextAuthCallback.searchParams.set("token", token);
  nextAuthCallback.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(nextAuthCallback);
}
