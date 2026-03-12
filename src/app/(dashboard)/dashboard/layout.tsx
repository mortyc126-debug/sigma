export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen px-4 py-6 md:px-8 lg:px-12">
      {/* Видео-фон личного кабинета. Файл: public/videos/dashboard-bg.mp4 */}
      <video
        className="pointer-events-none fixed inset-0 -z-[5] h-full w-full object-cover"
        src="/videos/dashboard-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 -z-[4] bg-black/55" aria-hidden />
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}

