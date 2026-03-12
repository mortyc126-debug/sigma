import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4 text-sm">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Sigma Models
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">
            Проверьте вашу почту
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Ссылка для входа отправлена на ваш email. Перейдите по ней, чтобы войти в личный кабинет.
        </p>
        <p className="text-xs text-muted-foreground">
          Если письмо не пришло в течение нескольких минут — проверьте папку «Спам».
        </p>
        <Link
          href="/login"
          className="inline-flex items-center text-xs text-muted-foreground underline-offset-4 hover:underline"
        >
          Вернуться к входу
        </Link>
      </div>
    </main>
  );
}
