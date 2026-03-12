import NextAuth, { getServerSession, type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { resend } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase/server";

const adminEmail = process.env.SIGMA_ADMIN_EMAIL;

export const authConfig: NextAuthOptions = {
  providers: [
    EmailProvider({
      async sendVerificationRequest({ identifier, url }) {
        // Белый список email: админ + адреса, на которые есть активные инвайты или уже создан профиль.
        const email = identifier.toLowerCase().trim();

        // 1) Админский email всегда разрешён.
        if (!email || (adminEmail && email === adminEmail.toLowerCase().trim())) {
          // ok
        } else {
          // 2) Проверяем, есть ли профиль с таким email.
          const { data: existingProfile } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", email)
            .maybeSingle();

          // 3) Или активный инвайт на этот email.
          const nowIso = new Date().toISOString();
          const { data: activeInvite } = await supabaseAdmin
            .from("invite_codes")
            .select("id")
            .eq("email", email)
            .is("used_by", null)
            .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
            .maybeSingle();

          if (!existingProfile && !activeInvite) {
            console.warn(
              "[Sigma Models] Отказ в отправке ссылки входа: email не в белом списке",
              email,
            );
            return;
          }
        }

        // Если Resend не сконфигурирован — просто логируем и выходим.
        if (!resend) {
          console.warn(
            "[Sigma Models] Попытка отправки письма входа, но RESEND_API_KEY не задан.",
          );
          return;
        }

        const from = process.env.RESEND_FROM_EMAIL || "Sigma Models <official@sigma-model.com>";

        try {
          const result = await resend.emails.send({
            from,
            to: identifier,
            subject: "Sigma Models — безопасная ссылка для входа",
            html: `
            <div style="background-color:#050509;padding:32px 24px;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;color:#f7f4ea;">
              <div style="max-width:480px;margin:0 auto;">
                <div style="text-align:center;margin-bottom:24px;">
                  <div style="font-size:28px;letter-spacing:0.35em;text-transform:uppercase;color:#f7d26a;">Σ</div>
                  <div style="font-size:13px;letter-spacing:0.28em;text-transform:uppercase;color:#b3a58a;margin-top:8px;">
                    SIGMA MODELS
                  </div>
                </div>
                <p style="font-size:14px;line-height:1.6;margin:0 0 16px 0;">
                  Вы запросили безопасную ссылку для входа в личный кабинет
                  <span style="white-space:nowrap;">Sigma Models.</span>
                </p>
                <p style="font-size:13px;line-height:1.6;margin:0 0 20px 0;color:#d0c6b0;">
                  Если вы не запрашивали вход, просто проигнорируйте это письмо.
                </p>
                <div style="text-align:center;margin:28px 0;">
                  <a href="${url}" style="display:inline-block;padding:12px 24px;background:#f7d26a;color:#111016;text-decoration:none;border-radius:999px;font-size:13px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;">
                    Войти в кабинет
                  </a>
                </div>
                <p style="font-size:11px;line-height:1.6;color:#918777;margin:0;">
                  Ссылка действует ограниченное время и привязана к этому
                  <span style="white-space:nowrap;">email-адресу.</span>
                </p>
              </div>
            </div>
          `,
          });

          console.log(
            "[Sigma Models] Verification email sent via Resend:",
            result,
          );
        } catch (error) {
          console.error(
            "[Sigma Models] Error sending verification email via Resend:",
            error,
          );
        }
      },
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  pages: {
    signIn: "/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async signIn(args) {
      const { user } = args;
      const request = (args as { user?: { id?: string; email?: string | null }; request?: { nextUrl?: URL; url?: string } }).request;
      if (!user?.email) return false;

      const userId = user.id as string;

      // Проверяем, есть ли профиль в таблице profiles.
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("id, role")
        .eq("id", userId)
        .maybeSingle();

      // Первый логин администратора — создаём профиль admin.
      if (adminEmail && user.email === adminEmail) {
        if (!existingProfile) {
          await supabaseAdmin.from("profiles").insert({
            id: userId,
            email: user.email,
            role: "admin",
          });
        } else if (existingProfile.role !== "admin") {
          await supabaseAdmin
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", userId);
        }
        return true;
      }

      // Для всех остальных пользователей — строгая работа по инвайтам.
      if (existingProfile) {
        // Профиль уже есть, пускаем.
        return true;
      }

      // The invite token is embedded inside the callbackUrl query param
      // (e.g. /dashboard?invite=<token>) so it survives the NextAuth email
      // verification round-trip.  We must NOT read request.nextUrl's own
      // "token" param — that is NextAuth's internal verification token.
      let token: string | null = null;

      const extractInvite = (rawUrl: string | URL | undefined | null): string | null => {
        if (!rawUrl) return null;
        try {
          const url = rawUrl instanceof URL ? rawUrl : new URL(rawUrl, "http://localhost");
          const callbackParam = url.searchParams.get("callbackUrl");
          if (callbackParam) {
            const cb = new URL(decodeURIComponent(callbackParam), "http://localhost");
            return cb.searchParams.get("invite");
          }
        } catch {
          // ignore
        }
        return null;
      };

      token = extractInvite(request?.nextUrl) ?? extractInvite(request?.url);

      if (!token) {
        return false;
      }

      const { data: invite } = await supabaseAdmin
        .from("invite_codes")
        .select("id, role, email, expires_at, used_by")
        .eq("token", token)
        .is("used_by", null)
        .maybeSingle();

      if (!invite) {
        return false;
      }

      if (invite.expires_at && invite.expires_at < new Date().toISOString()) {
        return false;
      }

      if (invite.email && invite.email !== user.email) {
        return false;
      }

      // Создаём профиль и запись модели + баланс для нового пользователя.
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: userId,
          email: user.email,
          role: invite.role ?? "model",
        })
        .select("id")
        .single();

      if (profile) {
        const { data: model } = await supabaseAdmin
          .from("models")
          .insert({ profile_id: profile.id })
          .select("id")
          .single();

        if (model) {
          await supabaseAdmin.from("balances").insert({
            model_id: model.id,
            amount: 0,
            currency: "RUB",
          });
        }
      }

      await supabaseAdmin
        .from("invite_codes")
        .update({
          used_by: userId,
          used_at: new Date().toISOString(),
        })
        .eq("id", invite.id);

      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;

        // Читаем роль из таблицы profiles.
        const { data } = await supabaseAdmin
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        session.user.role = data?.role ?? "model";
      }
      return session;
    },
  },
};

// Хэндлер для API-роута в App Router (используется в route.ts)
export const authHandler = NextAuth(authConfig);

// Унифицированный helper для получения сессии на сервере (RSC, server actions)
export async function auth() {
  return getServerSession(authConfig);
}


