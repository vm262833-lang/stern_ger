'use client';
import { useState, useEffect } from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import AIChatWidget from '@/components/AIChatWidget';
import ThemeColorCustomizer from '@/components/ThemeColorCustomizer';
import SignInModal from '@/components/SignInModal';

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('dark');
  const [showSignIn, setShowSignIn] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('sg-theme');
    if (saved) setTheme(saved);
    const savedUser = localStorage.getItem('sg-user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sg-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleSignIn = (userData) => {
    setUser(userData);
    localStorage.setItem('sg-user', JSON.stringify(userData));
    setShowSignIn(false);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('sg-user');
  };

  return (
    <html lang="en" data-theme={theme}>
      <head>
        <title>The Stern-Gerlach Experiment — Interactive Physics</title>
        <meta name="description" content="An in-depth, interactive exploration of the Stern-Gerlach experiment: experimental setup, derivations, Pauli matrices, Bloch sphere, sequential experiments, and real-world applications." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
      </head>
      <body>
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

        {/* Mobile header */}
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: 'var(--accent-1)' }}>
            Stern-Gerlach
          </span>
        </div>

        {mobileMenuOpen && <div className="mobile-overlay visible" onClick={() => setMobileMenuOpen(false)} />}

        <div className="app-layout">
          <Sidebar
            theme={theme}
            onToggleTheme={toggleTheme}
            user={user}
            onSignInClick={() => setShowSignIn(true)}
            onSignOut={handleSignOut}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
          <main className="main-content">
            {children}
          </main>
        </div>

        <AIChatWidget />
        <ThemeColorCustomizer />

        <SignInModal
          open={showSignIn}
          onClose={() => setShowSignIn(false)}
          onSignIn={handleSignIn}
        />
      </body>
    </html>
  );
}
