export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white font-semibold text-lg">
              New Project
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              Features
            </a>
            <button className="bg-accent hover:bg-accent/90 text-white text-sm font-medium px-4 py-2 rounded-md transition-all hover:shadow-lg hover:shadow-accent/25">
              Get Started
            </button>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-white/80 text-sm">
              Ready to build something amazing
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Your Next Big{' '}
            <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
              Idea
            </span>{' '}
            Starts Here
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
            A modern, production-ready stack with Next.js 14, Supabase,
            and Tailwind CSS. Everything you need to ship fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-accent hover:bg-accent/90 text-white font-medium px-8 py-3 rounded-md transition-all hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5">
              Start Building →
            </button>
            <button className="border border-white/20 text-white hover:bg-white/10 font-medium px-8 py-3 rounded-md transition-all backdrop-blur-sm">
              View Documentation
            </button>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </header>

      {/* Features Section */}
      <main className="flex-1">
        <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built with the Best
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A carefully curated stack designed for developer experience and
              production performance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Next.js 14',
                description:
                  'App Router, Server Components, and streaming for blazing-fast pages.',
                icon: '⚡',
                gradient: 'from-blue-500/10 to-cyan-500/10',
              },
              {
                title: 'Supabase',
                description:
                  'Postgres database, real-time subscriptions, auth, and storage out of the box.',
                icon: '🗄️',
                gradient: 'from-emerald-500/10 to-green-500/10',
              },
              {
                title: 'Tailwind CSS',
                description:
                  'Utility-first styling with shadcn/ui components and custom design tokens.',
                icon: '🎨',
                gradient: 'from-violet-500/10 to-purple-500/10',
              },
              {
                title: 'TypeScript',
                description:
                  'End-to-end type safety from database to UI with generated types.',
                icon: '🔒',
                gradient: 'from-blue-500/10 to-indigo-500/10',
              },
              {
                title: 'React Query',
                description:
                  'Intelligent caching, background refetching, and optimistic updates.',
                icon: '🔄',
                gradient: 'from-red-500/10 to-orange-500/10',
              },
              {
                title: 'Zustand',
                description:
                  'Lightweight, flexible client-side state management without boilerplate.',
                icon: '🐻',
                gradient: 'from-amber-500/10 to-yellow-500/10',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`group relative rounded-xl border border-border/50 bg-gradient-to-br ${feature.gradient} p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1`}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} New Project. Built with ❤️
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
