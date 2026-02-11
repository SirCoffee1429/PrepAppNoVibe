import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-accent shadow-xl shadow-accent/30 mx-auto">
            <span className="text-3xl font-bold">P</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              PrepAppNoVibe
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
              Automated prep lists. Real-time kitchen tracking.
              Zero guesswork.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/kitchen"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors active:scale-95"
            >
              🔥 Kitchen Dashboard
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-slate-700 text-slate-300 font-medium text-sm hover:bg-slate-800 hover:text-white transition-colors active:scale-95"
            >
              ⚙️ Admin Panel
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center pb-6 text-xs text-slate-600">
        Built for the line. No nonsense.
      </footer>
    </div>
  );
}
