"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface ThemeContextType {
  isDark: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  isDark: true,
  theme: "dark",
  toggleTheme: () => {},
});

function useTheme() {
  return React.useContext(ThemeContext);
}

function useReveal() {
  useEffect(() => {
    const t = setTimeout(() => {
      const els = document.querySelectorAll<Element>(".reveal, .reveal-left, .reveal-right");
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              io.unobserve(e.target);
            }
          }),
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => io.observe(el));
      return () => io.disconnect();
    }, 80);
    return () => clearTimeout(t);
  }, []);
}

function useParallax(speed = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!ref.current || !ref.current.parentElement) return;
      const rect = ref.current.parentElement.getBoundingClientRect();
      ref.current.style.transform = `translateY(${-rect.top * speed}px)`;
    });
  }, [speed]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return ref;
}

function AmbientOrbs() {
  const { isDark } = useTheme();
  const mouseGlow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let tx = window.innerWidth / 2,
      ty = window.innerHeight / 2;
    let cx = tx,
      cy = ty;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const move = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const tick = () => {
      cx = lerp(cx, tx, 0.06);
      cy = lerp(cy, ty, 0.06);
      if (mouseGlow.current) {
        mouseGlow.current.style.transform = `translate(${cx - 300}px, ${cy - 300}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={mouseGlow}
        className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(31,207,171,0.06) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 65%)",
          top: 0,
          left: 0,
        }}
      />
      <div
        className="orb-1 absolute top-[-15vh] left-[-8vw] w-[65vw] h-[65vw] max-w-[860px] max-h-[860px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(31,207,171,0.07) 0%, transparent 68%)"
            : "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 68%)",
        }}
      />
      <div
        className="orb-2 absolute bottom-[5vh] right-[-12vw] w-[55vw] h-[55vw] max-w-[760px] max-h-[760px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(124,158,248,0.065) 0%, transparent 68%)"
            : "radial-gradient(circle, rgba(99,102,241,0.045) 0%, transparent 68%)",
        }}
      />
      <div
        className="orb-3 absolute top-[35vh] left-[25vw] w-[45vw] h-[45vw] max-w-[640px] max-h-[640px] rounded-full"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(201,126,248,0.04) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(168,85,247,0.035) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

function Nav() {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 md:mx-8 mt-4">
        <div
          className={`rounded-2xl px-6 h-14 flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? isDark
                ? "bg-[#030810]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
                : "bg-white/85 backdrop-blur-2xl border border-purple-200/80 shadow-[0_8px_30px_rgba(124,58,237,0.08)]"
              : isDark
              ? "bg-[#030810]/40 backdrop-blur-md border border-white/10 shadow-sm"
              : "bg-white/50 backdrop-blur-md border border-purple-100/60 shadow-sm"
          }`}
        >
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-lg ${
                isDark
                  ? "bg-gradient-to-br from-[#1fcfab] to-[#0d8a73] shadow-[#1fcfab]/30"
                  : "bg-gradient-to-br from-purple-600 to-indigo-600 shadow-purple-600/20"
              }`}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                <circle cx="8" cy="8" r="3" fill="white" />
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="white"
                  strokeWidth="0.8"
                  strokeDasharray="2 1.5"
                  opacity="0.75"
                />
              </svg>
            </div>
            <span
              className={`font-display font-bold text-sm ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              AquaWatch
              <span className={isDark ? "text-[#1fcfab]" : "text-purple-600"}>AI</span>
              <span
                className={`ml-1.5 text-[10px] font-mono-label font-normal px-1.5 py-0.5 rounded border ${
                  isDark
                    ? "text-[#1fcfab] bg-[#1fcfab]/10 border-[#1fcfab]/30"
                    : "text-purple-700 bg-purple-50 border-purple-200"
                }`}
              >
                Kwali
              </span>
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-7">
            {["How It Works", "For Communities", "For Organizations", "Impact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                className={`font-mono-label text-[10px] tracking-widest uppercase transition-all duration-300 font-medium ${
                  isDark
                    ? "text-white/45 hover:text-white"
                    : "text-slate-600 hover:text-purple-700"
                }`}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Controls: Theme Switcher, Sign In, Get Started */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
                isDark
                  ? "bg-white/5 border-white/15 text-amber-300 hover:bg-white/10 hover:text-amber-200"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                /* Sun Icon */
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                /* Moon Icon */
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link
              href="/community"
              className={`font-mono-label text-[11px] tracking-wider uppercase transition-colors duration-200 font-medium ${
                isDark ? "text-[#1fcfab] hover:text-white" : "text-purple-700 hover:text-purple-900"
              }`}
            >
              Community Portal
            </Link>
            <Link
              href="/signin"
              className={`font-mono-label text-[11px] tracking-wider uppercase transition-colors duration-200 font-medium ${
                isDark ? "text-white/55 hover:text-white" : "text-slate-600 hover:text-purple-700"
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={`relative group px-5 py-2 rounded-xl font-mono-label text-[11px] tracking-wider uppercase font-semibold overflow-hidden transition-all duration-300 ${
                isDark
                  ? "bg-[#1fcfab] text-[#030810] hover:shadow-[0_0_24px_rgba(31,207,171,0.5)]"
                  : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-[0_0_24px_rgba(124,58,237,0.4)]"
              }`}
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Mobile hamburger + theme toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border text-xs ${
                isDark
                  ? "bg-white/10 border-white/20 text-amber-300"
                  : "bg-slate-100 border-slate-300 text-slate-700"
              }`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <button
              className={`transition-colors ${
                isDark ? "text-white/70 hover:text-white" : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                {open ? (
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div
            className={`mt-2 backdrop-blur-2xl rounded-2xl p-4 flex flex-col gap-4 shadow-2xl border ${
              isDark
                ? "bg-[#030810]/95 border-white/10"
                : "bg-white/95 border-purple-200/80"
            }`}
          >
            {["How It Works", "For Communities", "For Organizations", "Impact"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setOpen(false)}
                className={`font-mono-label text-[11px] tracking-wider uppercase transition-colors font-medium ${
                  isDark
                    ? "text-white/60 hover:text-white"
                    : "text-slate-700 hover:text-purple-700"
                }`}
              >
                {l}
              </a>
            ))}
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className={`text-center px-4 py-3 rounded-xl font-mono-label text-[11px] tracking-wider uppercase font-semibold shadow-md ${
                isDark ? "bg-[#1fcfab] text-[#030810]" : "bg-purple-600 text-white"
              }`}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

function Hero() {
  const { isDark } = useTheme();
  const parallaxRef = useParallax(0.25);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background showing rural Kwali watershed clearly */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-[-10%] will-change-transform opacity-100">
          <img
            src="https://images.unsplash.com/photo-1780311494517-8223d32e5053?w=1800&h=1200&fit=crop&auto=format"
            alt="Aerial view of a rural African town and watershed"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Scrim gradients: rich directional overlay ensuring 100% text contrast without washing out the village on the right or middle */}
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-[#030810] via-[#030810]/75 to-[#030810]/20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030810]/95 via-[#030810]/75 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#030810] to-transparent pointer-events-none" />
          </>
        ) : (
          <>
            {/* Directional scrim focused on text readability on the left: drops to transparent before the middle so the middle and ends stay clear */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 25%, rgba(255,255,255,0.08) 45%, transparent 60%)",
              }}
            />
            {/* Subtle localized soft glow strictly behind the headline for razor-sharp typography contrast */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 18% 40%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.15) 35%, transparent 60%)",
              }}
            />
            {/* Slim, soft bottom edge fade so the bottom ends remain clear while cleanly connecting to the ticker */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-28 pt-40 w-full">
        <div className="max-w-4xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2.5 mb-10 reveal">
            <div className="relative flex items-center justify-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  isDark ? "bg-[#1fcfab]" : "bg-purple-600"
                }`}
              />
              <div
                className={`ring-pulse absolute w-2 h-2 rounded-full ${
                  isDark ? "text-[#1fcfab]" : "text-purple-600"
                }`}
              />
            </div>
            <span
              className={`font-mono-label text-[10px] tracking-[0.22em] uppercase font-bold px-3.5 py-1.5 rounded-full border backdrop-blur-md ${
                isDark
                  ? "text-[#1fcfab] bg-[#1fcfab]/10 border-[#1fcfab]/25 shadow-[0_0_15px_rgba(31,207,171,0.2)]"
                  : "text-purple-800 bg-purple-50/90 border-purple-200"
              }`}
            >
              Live WASH Intelligence Platform · Kwali FCT
            </span>
          </div>

          {/* Headline with razor-sharp contrast */}
          <h1 className="font-display font-light leading-[0.93] mb-8 reveal reveal-delay-1 tracking-tight">
            <span
              className={`block text-5xl md:text-7xl lg:text-[90px] font-normal drop-shadow-md ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Every village
            </span>
            <span
              className={`block text-5xl md:text-7xl lg:text-[90px] font-normal drop-shadow-md ${
                isDark ? "grad-teal" : "grad-purple"
              }`}
            >
              deserves
            </span>
            <span
              className={`block text-5xl md:text-7xl lg:text-[90px] font-normal drop-shadow-md ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              clean water.
            </span>
          </h1>

          {/* Subtitle paragraph */}
          <p
            className={`text-lg md:text-xl leading-relaxed max-w-2xl mb-12 reveal reveal-delay-2 drop-shadow-sm ${
              isDark ? "text-white/80 font-normal" : "text-slate-800 font-medium"
            }`}
          >
            AquaWatchAI turns local communities into smart scouts and sensor data into immediate action through a living digital twin of rural WASH infrastructure that keeps taps running.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-16 md:mb-20 reveal reveal-delay-3">
            <Link
              href="/signup?role=community"
              className={`shimmer-wrap group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-mono-label text-[12px] tracking-widest uppercase font-semibold overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] ${
                isDark
                  ? "bg-[#1fcfab] text-[#030810] hover:shadow-[0_0_60px_rgba(31,207,171,0.5)]"
                  : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]"
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                Join as Community Scout
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  <path d="M2 7.5h11M9 3.5l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="shimmer-inner" />
            </Link>
            <Link
              href="/signup?role=institutional"
              className={`inline-flex items-center gap-3 px-8 py-4 rounded-xl font-mono-label text-[12px] tracking-widest uppercase font-semibold transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5 ${
                isDark
                  ? "bg-white/8 border border-white/15 text-white hover:bg-white/14 hover:border-white/30"
                  : "bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 shadow-sm"
              }`}
            >
              For RUWASSA & NGOs
            </Link>
          </div>

          {/* Stats bar */}
          <div
            className={`flex flex-wrap gap-10 border-t pt-8 reveal reveal-delay-4 ${
              isDark ? "border-white/10" : "border-purple-100"
            }`}
          >
            {[
              { val: "70M+", label: "Lack safe water in Nigeria" },
              { val: "14,200+", label: "Indexed Community Reports" },
              { val: "< 4h", label: "Report to repair cycle" },
              { val: "98.4%", label: "Verified borehole uptime" },
            ].map((s) => (
              <div key={s.label}>
                <div
                  className={`font-display text-3xl md:text-4xl font-light stat-glow ${
                    isDark ? "text-white" : "text-slate-900 font-bold"
                  }`}
                >
                  {s.val}
                </div>
                <div
                  className={`font-mono-label text-[10px] tracking-widest uppercase mt-1 ${
                    isDark ? "text-white/40" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Ticker() {
  const { isDark } = useTheme();
  const items = [
    "IoT Acoustic Sensors",
    "Google Gemini AI",
    "Digital Twin Simulator",
    "RUWASSA FCT",
    "Community Water Guardians",
    "Real-time Borehole Health",
    "Kwali Area Council",
    "Zero Guesswork Dispatch",
  ];
  const doubled = [...items, ...items];

  return (
    <div
      className={`relative py-5 overflow-hidden border-y ${
        isDark ? "border-white/6 bg-[#030810]" : "border-purple-100 bg-white"
      }`}
    >
      <div className="ticker-inner flex gap-12 whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono-label text-[10px] tracking-[0.22em] uppercase flex items-center gap-12 font-medium"
          >
            <span className={isDark ? "text-white/30" : "text-slate-600"}>
              {item}
            </span>
            <span className={isDark ? "text-[#1fcfab]/40" : "text-purple-500"}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Stakes() {
  const { isDark } = useTheme();
  const [activeAlert, setActiveAlert] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAlert((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const alerts = [
    {
      badge: "Live Alert · Solar Inverter Fault",
      badgeColor: "text-rose-500",
      beaconBg: "bg-rose-500/15",
      dotBg: "bg-rose-500",
      ringColor: "text-rose-500",
      text: "Kilankwa Ward, Kwali · 847 households affected",
      time: "2 min ago",
    },
    {
      badge: "Live Alert · Open Refuse & Blocked Gutter",
      badgeColor: "text-amber-400",
      beaconBg: "bg-amber-400/15",
      dotBg: "bg-amber-400",
      ringColor: "text-amber-400",
      text: "Ashara Market Road, Kwali · Contamination risk flagged",
      time: "Just now",
    },
  ];

  const curr = alerts[activeAlert];

  return (
    <section className={`relative py-32 overflow-hidden ${isDark ? "bg-[#030810]" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Visual Collage */}
          <div className="relative reveal-left">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="img-hover relative rounded-2xl overflow-hidden h-64 shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
                  <img
                    src="https://images.unsplash.com/photo-1714327676794-7f8863501daf?w=500&h=400&fit=crop&auto=format"
                    alt="Woman carrying water in rural setting"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 font-mono-label text-[9px] text-white/80 tracking-wider">
                    4.2 km avg daily walk for water
                  </div>
                </div>
                <div className="img-hover relative rounded-2xl overflow-hidden h-40 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <img
                    src="/images/nigeria_rural_sanitation.jpg"
                    alt="Nigerian community members inspecting rural drainage and refuse waste in Kwali"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2.5 left-3 right-3 font-mono-label text-[9px] text-white/90 tracking-wider font-medium">
                    Village refuse & drainage inspection
                  </div>
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="img-hover relative rounded-2xl overflow-hidden h-40 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <img
                    src="https://images.unsplash.com/photo-1738956312126-01ba60788071?w=500&h=300&fit=crop&auto=format"
                    alt="Solar borehole point in rural community"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="img-hover relative rounded-2xl overflow-hidden h-64 shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
                  <img
                    src="https://images.unsplash.com/photo-1760873059715-7c7cfbe2a2c6?w=500&h=400&fit=crop&auto=format"
                    alt="Community at water pump"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 font-mono-label text-[9px] text-white/80 tracking-wider">
                    1 in 3 rural pumps fail within 18 months
                  </div>
                </div>
              </div>
            </div>

            {/* Live Incident Alert Banner (Animated dual-incident ticker) */}
            <div
              onClick={() => setActiveAlert((prev) => (prev === 0 ? 1 : 0))}
              className={`absolute -bottom-5 left-1/2 -translate-x-1/2 backdrop-blur-2xl rounded-2xl px-5 py-3.5 flex items-center gap-3 whitespace-nowrap shadow-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? "bg-[#0a1628]/95 border-white/10 text-white shadow-[0_24px_64px_rgba(0,0,0,0.8)]"
                  : "bg-white/95 border-rose-200 text-slate-900 shadow-xl"
              }`}
              title="Click to toggle live alerts"
            >
              <div className={`relative w-8 h-8 rounded-full ${curr.beaconBg} flex items-center justify-center flex-shrink-0 transition-colors duration-500`}>
                <div className={`w-2.5 h-2.5 rounded-full ${curr.dotBg}`} />
                <div className={`ring-pulse absolute w-2.5 h-2.5 rounded-full ${curr.ringColor}`} />
              </div>
              <div className="transition-all duration-300">
                <div className="flex items-center gap-2">
                  <p className={`font-mono-label text-[9px] ${curr.badgeColor} tracking-widest uppercase font-bold`}>
                    {curr.badge}
                  </p>
                  <span className={`text-[8px] font-mono-label px-1.5 py-0.2 rounded border ${isDark ? "bg-white/5 border-white/10 text-white/40" : "bg-slate-100 border-slate-200 text-slate-500"}`}>
                    {activeAlert + 1}/2
                  </span>
                </div>
                <p className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-900 font-semibold"}`}>
                  {curr.text}
                </p>
              </div>
              <div className={`ml-2 font-mono-label text-[9px] ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {curr.time}
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-mono-label uppercase tracking-widest mb-6 reveal ${
                isDark
                  ? "bg-[#1fcfab]/10 border-[#1fcfab]/25 text-[#1fcfab]"
                  : "bg-purple-50 border-purple-200 text-purple-800 font-bold"
              }`}
            >
              Kwali Area Council & Rural FCT Ground Realities
            </div>
            <h2 className="font-display font-light leading-[0.95] mb-8 reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl">
              <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                Data collected once.
              </span>
              <span className={`block ${isDark ? "text-white/30" : "text-slate-400 font-bold"}`}>
                Breakdowns happen
              </span>
              <span className={`block ${isDark ? "text-white/30" : "text-slate-400 font-bold"}`}>
                every day.
              </span>
            </h2>
            <p
              className={`text-lg leading-relaxed mb-10 reveal reveal-delay-2 font-normal ${
                isDark ? "text-white/45" : "text-slate-600"
              }`}
            >
              Governments spend millions on annual WASH audits, then those binders gather dust while borehole pumps grind to a halt and rural refuse heaps spill across village paths. In Kwali, dry seasons leave thousands without safe water, while unmanaged waste threatens public health.
            </p>

            <div className="space-y-3 reveal reveal-delay-3">
              {[
                {
                  icon: "⚡",
                  stat: "73%",
                  text: "Of Nigerian rural borehole failures go unreported for over 3 months",
                },
                {
                  icon: "🗑️",
                  stat: "81%",
                  text: "Of rural Kwali refuse heaps and drainage blockages lack municipal collection",
                },
                {
                  icon: "📋",
                  stat: "18 mo",
                  text: "Average gap between formal government WASH surveys in rural wards",
                },
                {
                  icon: "💧",
                  stat: "₦14B+",
                  text: "Lost annually across Nigeria to premature redrilling and untreated environmental contamination",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className={`card-lift flex items-start gap-4 rounded-2xl p-4 backdrop-blur-sm border transition-all ${
                    isDark
                      ? "bg-white/4 border-white/7 hover:border-white/20"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <span className="text-2xl mt-0.5">{item.icon}</span>
                  <div>
                    <span
                      className={`font-display text-2xl ${
                        isDark ? "text-[#1fcfab] font-light" : "text-purple-700 font-bold"
                      }`}
                    >
                      {item.stat}{" "}
                    </span>
                    <span className={`text-sm ${isDark ? "text-white/50" : "text-slate-700 font-medium"}`}>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DigitalTwinCardVisual({ isDark }: { isDark: boolean }) {
  const [simulated, setSimulated] = useState(false);

  return (
    <div
      className={`relative h-40 w-full rounded-2xl overflow-hidden border p-3.5 flex flex-col justify-between select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${
        isDark
          ? "bg-[#071120] border-[#c97ef8]/30"
          : "bg-[#0a1128] border-purple-400/40 text-white"
      }`}
    >
      {/* Background grid matrix */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#c97ef8 1px, transparent 1px), linear-gradient(to right, #c97ef8 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />

      {/* Top Header: Badge and Live Node Indicator */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#c97ef8]/20 border border-[#c97ef8]/40 backdrop-blur-sm">
            <span className="font-mono-label text-[10px] font-bold text-[#c97ef8]">03</span>
          </div>
          <div>
            <p className="font-mono-label text-[8px] text-white/90 font-bold tracking-wider">
              KW-BH-04B
            </p>
            <p className="font-mono-label text-[7px] text-[#c97ef8] tracking-widest uppercase font-semibold">
              Digital Twin · Kilankwa
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-colors duration-300 ${
            simulated
              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
              : "bg-rose-500/15 border-rose-500/30 text-rose-400"
          }`}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                simulated ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                simulated ? "bg-emerald-400" : "bg-rose-400"
              }`}
            />
          </span>
          <span className="font-mono-label text-[7px] font-bold tracking-wider uppercase">
            {simulated ? "TWIN: OPTIMAL" : "CAVITATION RISK"}
          </span>
        </div>
      </div>

      {/* Center: Dynamic Virtual Pressure Curve & Stress Telemetry */}
      <div className="relative z-10 my-1">
        <div className="flex items-center justify-between text-[7.5px] font-mono-label text-white/60 mb-0.5">
          <span>VIRTUAL PRESSURE CURVE</span>
          <span className={simulated ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
            {simulated ? "4.1 BAR · STABLE" : "2.4 BAR · ERRATIC"}
          </span>
        </div>

        {/* Real-time SVG Waveform */}
        <div className="relative h-7 w-full bg-black/40 rounded-lg border border-white/10 overflow-hidden flex items-center px-1">
          <svg className="w-full h-full" viewBox="0 0 240 28" preserveAspectRatio="none">
            {/* Grid baseline */}
            <line x1="0" y1="14" x2="240" y2="14" stroke="rgba(255,255,255,0.1)" strokeDasharray="3 3" />
            {/* Dynamic Curve */}
            {simulated ? (
              // Stable harmonic wave
              <path
                d="M0,14 Q30,6 60,14 T120,14 T180,14 T240,14"
                fill="none"
                stroke="#1fcfab"
                strokeWidth="2"
              />
            ) : (
              // Erratic cavitation wave
              <path
                d="M0,14 Q20,3 40,24 T80,5 T120,25 T160,7 T200,23 T240,14"
                fill="none"
                stroke="#c97ef8"
                strokeWidth="2"
              />
            )}
          </svg>
          <div className="absolute right-2 text-[7px] font-mono-label text-white/40">
            {simulated ? "0.02% THD" : "2.8g RMS"}
          </div>
        </div>
      </div>

      {/* Bottom Row: Seal Stress Test & Interactive Simulation Toggle */}
      <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10">
        <div>
          <p className="font-mono-label text-[7.5px] text-white/50 tracking-wider">
            SEAL STRESS:{" "}
            <strong className={simulated ? "text-emerald-400" : "text-rose-400"}>
              {simulated ? "4% (PASS)" : "84% (WEAR)"}
            </strong>
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSimulated((prev) => !prev);
          }}
          className={`font-mono-label text-[8px] tracking-wider uppercase px-2.5 py-1 rounded-full cursor-pointer transition-all duration-300 border ${
            simulated
              ? "bg-[#1fcfab]/20 border-[#1fcfab]/50 text-[#1fcfab] hover:bg-[#1fcfab]/30"
              : "bg-[#c97ef8]/25 border-[#c97ef8]/60 text-[#c97ef8] hover:bg-[#c97ef8]/40 shadow-[0_0_12px_rgba(201,126,248,0.3)]"
          }`}
        >
          {simulated ? "✓ Fixed: ₦280k" : "⚡ Simulate Fix"}
        </button>
      </div>
    </div>
  );
}

function Pipeline() {
  const { isDark } = useTheme();

  const steps = [
    {
      num: "01",
      icon: "📡",
      title: "Community Reports",
      sub: "Capture",
      color: "#1fcfab",
      desc: "Scouts photograph pump faults and unmanaged refuse heaps with GPS. For boreholes, IoT acoustic sensors capture pump vibrations 24/7.",
      img: "/images/nigerian_scout_phone.jpg",
      imgAlt: "Nigerian community scout reporting borehole status on smartphone",
    },
    {
      num: "02",
      icon: "🧠",
      title: "AI Ingests & Understands",
      sub: "Analyze",
      color: "#7c9ef8",
      desc: "Google Gemini 3.8 Flash ingests acoustic sensor streams and scout hazard photos, building a living understanding stored in pgvector.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format",
      imgAlt: "Analytics dashboard",
    },
    {
      num: "03",
      icon: "🌐",
      title: "Digital Twin Simulates",
      sub: "Simulate",
      color: "#c97ef8",
      desc: "A digital replica of Kwali watershed updates in real time. Simulates hydraulic pump stress and maps surface contamination risks.",
      img: "",
      imgAlt: "Interactive Digital Twin Simulation Wireframe",
    },
    {
      num: "04",
      icon: "✅",
      title: "Action & Feedback",
      sub: "Act",
      color: "#e8a94a",
      desc: "RUWASSA technicians dispatch for borehole parts; Kwali LGA sanitation crews clear refuse heaps. Clean water flows and scouts earn XP.",
      img: "/images/rural_borehole_solar.jpg",
      imgAlt: "Nigerian community member pumping clean water from a solar borehole",
    },
  ];

  return (
    <section
      id="how-it-works"
      className={`relative py-32 overflow-hidden border-t ${
        isDark ? "bg-[#030810] border-white/6" : "bg-white border-purple-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <p
            className={`font-mono-label text-[10px] tracking-[0.22em] uppercase mb-4 reveal font-semibold ${
              isDark ? "text-[#1fcfab]" : "text-purple-800"
            }`}
          >
            How It Works
          </p>
          <h2 className="font-display font-light leading-[0.95] mb-5 reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl">
            <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
              From crisis to clarity
            </span>
            <span className={`block ${isDark ? "text-white/25" : "text-slate-400 font-bold"}`}>
              in four steps
            </span>
          </h2>
          <p className={`text-lg max-w-xl mx-auto reveal reveal-delay-2 ${isDark ? "text-white/40" : "text-slate-600"}`}>
            A closed feedback loop connecting village scouts directly to RUWASSA technicians, eliminating guesswork.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Connecting gradient line */}
          <div
            className="hidden lg:block absolute top-[108px] left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(31,207,171,0.5) 0%, rgba(124,158,248,0.5) 33%, rgba(201,126,248,0.5) 66%, rgba(232,169,74,0.5) 100%)",
            }}
          />

          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`group card-lift rounded-2xl p-5 reveal reveal-delay-${i + 1} border transition-all ${
                isDark
                  ? "bg-white/4 border-white/7 hover:border-white/20"
                  : "bg-white border-purple-200/80 shadow-sm hover:border-purple-400"
              }`}
            >
              {s.num === "03" ? (
                <div className="mb-5">
                  <DigitalTwinCardVisual isDark={isDark} />
                </div>
              ) : (
                <div className="img-hover relative rounded-2xl overflow-hidden h-40 mb-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <img src={s.img} alt={s.imgAlt} className="w-full h-full object-cover" />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${
                      isDark ? "from-[#030810] via-[#030810]/40" : "from-slate-950/70 via-transparent"
                    } to-transparent`}
                  />
                  <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: `${s.color}22`, border: `1px solid ${s.color}50` }}
                  >
                    <span className="font-mono-label text-[10px] font-bold" style={{ color: s.color }}>
                      {s.num}
                    </span>
                  </div>
                  <div
                    className="absolute bottom-2.5 right-2.5 font-mono-label text-[8px] tracking-widest uppercase px-2.5 py-1 rounded-full backdrop-blur-md"
                    style={{
                      color: s.color,
                      backgroundColor: `${s.color}18`,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    {s.sub}
                  </div>
                </div>
              )}

              <div className="text-2xl mb-3">{s.icon}</div>
              <h3
                className={`font-display text-xl mb-2.5 transition-colors duration-300 ${
                  isDark
                    ? "text-white font-light group-hover:text-[#1fcfab]"
                    : "text-slate-900 font-bold group-hover:text-purple-700"
                }`}
              >
                {s.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? "text-white/40" : "text-slate-600 font-normal"}`}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const BADGES = [
  { icon: "💧", name: "First Drop", earned: true },
  { icon: "🧹", name: "Clean Ward", earned: true },
  { icon: "📸", name: "Ground Truth", earned: true },
  { icon: "🔥", name: "Streak Keeper", earned: true },
  { icon: "⭐", name: "WASH Champion", earned: false },
  { icon: "🏆", name: "Level 6 Guardian", earned: false },
];

function CommunitySection() {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<"report" | "impact" | "badges">("report");
  const [showPicker, setShowPicker] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [xp, setXp] = useState(2450);
  const [reports, setReports] = useState([
    { id: 1, type: "💧 Rattling Motor Noise", loc: "Kilankwa Central Well", status: "Resolved", color: "#1fcfab" },
    { id: 2, type: "🗑️ Uncollected Refuse Heap", loc: "Ashara Market Road", status: "Dispatched", color: "#7c9ef8" },
    { id: 3, type: "🚫 Blocked Runoff Gutter", loc: "Yangoji West Ward", status: "In Triage", color: "#e8a94a" },
  ]);

  const handleCreateReport = (type: string, loc: string, color: string) => {
    const newReport = {
      id: Date.now(),
      type,
      loc,
      status: "Dispatched",
      color,
    };
    setReports((prev) => [newReport, ...prev.slice(0, 2)]);
    setXp((prev) => prev + 50);
    setShowPicker(false);
    setToast("Report Dispatched! +50 XP Credited");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <section
      id="for-communities"
      className={`relative py-32 overflow-hidden border-t ${
        isDark ? "bg-[#030810] border-white/6" : "bg-white border-purple-100"
      }`}
    >
      <div
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 w-[50vw] h-[80vh]"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at left, rgba(31,207,171,0.06) 0%, transparent 65%)"
            : "radial-gradient(ellipse at left, rgba(124,58,237,0.05) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Text */}
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-7 reveal border ${
                isDark
                  ? "bg-[#1fcfab]/10 border-[#1fcfab]/20 text-[#1fcfab]"
                  : "bg-purple-50 border-purple-200 text-purple-800 font-bold"
              }`}
            >
              <span className="text-sm">🏡</span>
              <span className="font-mono-label text-[10px] tracking-widest uppercase font-semibold">
                For Communities & Scouts
              </span>
            </div>
            <h2 className="font-display font-light leading-[0.95] mb-7 reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl">
              <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                You see it first.
              </span>
              <span className={`block ${isDark ? "grad-teal" : "grad-purple"}`}>
                You get credit
              </span>
              <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                for it too.
              </span>
            </h2>
            <p className={`text-lg leading-relaxed mb-10 reveal reveal-delay-2 font-light ${isDark ? "text-white/45" : "text-slate-600"}`}>
              Report borehole breakdowns, overflowing refuse heaps, and blocked drainages directly with your phone. Every verified report triggers immediate local action and earns reputation points.
            </p>

            <div className="space-y-5 reveal reveal-delay-3">
              {[
                {
                  icon: "📍",
                  title: "Snap & Pin in 30 seconds",
                  desc: "Take a photo of the pump sputter or accumulated refuse, tap GPS coordinates, attach a voice note. Your report is live immediately.",
                },
                {
                  icon: "🎮",
                  title: "Earn badges and level up",
                  desc: "Advance from First Drop to Level 6 WASH Guardian. Verified water and sanitation reports earn XP and community recognition.",
                },
                {
                  icon: "🔔",
                  title: "Close the loop on both fronts",
                  desc: "Get notified when RUWASSA repairs the borehole pump and when Kwali LGA sanitation crews clear the waste dump.",
                },
                {
                  icon: "📊",
                  title: "Your community live health score",
                  desc: "Track your ward borehole uptime and waste clearance index in real time as local issues get resolved.",
                },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4 group cursor-default">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-all duration-300 border ${
                      isDark
                        ? "bg-[#1fcfab]/8 border-[#1fcfab]/15 group-hover:bg-[#1fcfab]/15 group-hover:scale-110"
                        : "bg-purple-50 border-purple-200 group-hover:bg-purple-100 group-hover:scale-105"
                    }`}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h4
                      className={`font-medium mb-1 transition-colors duration-200 ${
                        isDark
                          ? "text-white group-hover:text-[#1fcfab]"
                          : "text-slate-900 font-bold group-hover:text-purple-700"
                      }`}
                    >
                      {f.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-white/35" : "text-slate-600 font-normal"}`}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 reveal reveal-delay-4">
              <Link
                href="/community"
                className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-mono-label text-[11px] tracking-widest uppercase font-semibold transition-all duration-300 hover:scale-[1.02] ${
                  isDark
                    ? "bg-[#1fcfab]/15 border border-[#1fcfab]/30 text-[#1fcfab] hover:bg-[#1fcfab]/25"
                    : "bg-purple-100 border border-purple-200 text-purple-800 hover:bg-purple-200"
                }`}
              >
                <span>Launch Full Community Portal</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Phone Simulator */}
          <div className="flex justify-center lg:justify-end reveal-right reveal-delay-2">
            <div className="relative w-[300px]">
              {/* Ambient blur orb */}
              <div
                className={`absolute inset-0 rounded-[48px] blur-3xl scale-110 orb-3 ${
                  isDark ? "bg-[#1fcfab]/12" : "bg-purple-500/10"
                }`}
              />

              {/* Phone hardware frame */}
              <div
                className={`relative rounded-[42px] p-2.5 overflow-hidden shadow-2xl transition-all duration-500 ${
                  isDark
                    ? "bg-gradient-to-b from-[#0c1e36] to-[#071528] border border-white/12 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(31,207,171,0.08)]"
                    : "bg-slate-900 shadow-[0_25px_60px_-15px_rgba(124,58,237,0.25)]"
                }`}
              >
                <div className={`rounded-[34px] overflow-hidden ${isDark ? "bg-transparent" : "bg-slate-50 border border-slate-200"}`}>
                  {/* Status bar */}
                  <div className={`px-5 pt-3.5 pb-2 flex justify-between items-center ${isDark ? "bg-transparent" : "bg-white border-b border-slate-100"}`}>
                    <span className={`font-mono-label text-[10px] ${isDark ? "text-white/30" : "text-slate-500 font-semibold"}`}>
                      9:41
                    </span>
                    <div className="w-16 h-4 bg-black rounded-full" />
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-2 rounded-sm border ${isDark ? "border-white/25" : "border-slate-400"}`} />
                      <div className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#1fcfab]" : "bg-emerald-500"}`} />
                    </div>
                  </div>

                  {/* App header */}
                  <div className={`px-5 pb-3 flex items-center justify-between ${isDark ? "bg-transparent" : "bg-white border-b border-purple-100"}`}>
                    <div>
                      <p className={`font-mono-label text-[8px] tracking-widest uppercase font-bold ${isDark ? "text-[#1fcfab]" : "text-purple-700"}`}>
                        AquaWatch Kwali
                      </p>
                      <p className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                        Fatima's Dashboard
                      </p>
                    </div>
                    <div className="relative">
                      <img
                        src="/images/nigerian_scout_phone.jpg"
                        alt="User Avatar"
                        className={`w-9 h-9 rounded-full object-cover border-2 ${isDark ? "border-[#1fcfab]" : "border-purple-600"}`}
                      />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                          isDark ? "bg-[#1fcfab] border-[#0c1e36]" : "bg-emerald-500 border-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className={`px-4 pb-3 ${isDark ? "bg-transparent" : "bg-slate-100/70"}`}>
                    <div className={`rounded-xl p-1 flex gap-1 ${isDark ? "bg-black/30 border border-white/5" : "bg-white border border-slate-200"}`}>
                      {(["report", "impact", "badges"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTab(t)}
                          className={`flex-1 py-1.5 rounded-lg font-mono-label text-[9px] tracking-wider uppercase font-semibold transition-all duration-300 cursor-pointer ${
                            tab === t
                              ? isDark
                                ? "bg-[#1fcfab] text-[#030810] shadow-md"
                                : "bg-purple-600 text-white shadow-xs"
                              : isDark
                              ? "text-white/35 hover:text-white/55"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab panels */}
                  <div className={`px-4 pb-6 min-h-[320px] ${isDark ? "bg-transparent" : "bg-slate-50"}`}>
                    {tab === "report" && (
                      <div className="space-y-2.5">
                        <div className="img-hover relative rounded-xl overflow-hidden h-28 border border-white/10">
                          <img
                            src="https://images.unsplash.com/photo-1785679625452-3f1b97d6ec81?w=400&h=200&fit=crop&auto=format"
                            alt="Satellite view of Kwali ward"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-2 left-2.5 flex items-center gap-1.5">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-[#1fcfab]" : "bg-purple-600"}`}>
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                            <span className="font-mono-label text-[8px] text-white">Kwali Rural · Kilankwa Ward</span>
                          </div>
                          <div className="absolute top-2 right-2 bg-rose-600/90 rounded-full px-2 py-0.5 shadow-xs">
                            <span className="font-mono-label text-[7px] text-white uppercase font-bold">Live Mesh</span>
                          </div>
                        </div>

                        {toast && (
                          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-mono-label text-[8px] text-center font-bold animate-pulse">
                            ⚡ {toast}
                          </div>
                        )}

                        {!showPicker ? (
                          <button
                            onClick={() => setShowPicker(true)}
                            className={`w-full rounded-xl py-2.5 font-mono-label text-[10px] tracking-widest uppercase font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isDark
                                ? "bg-[#1fcfab] text-[#030810] shadow-lg shadow-[#1fcfab]/25 hover:bg-[#17b998]"
                                : "bg-purple-600 text-white shadow-md shadow-purple-600/20 hover:bg-purple-700"
                            }`}
                          >
                            + New WASH & Waste Report
                          </button>
                        ) : (
                          <div className={`p-2.5 rounded-xl border space-y-1.5 ${isDark ? "bg-black/60 border-white/15" : "bg-purple-50 border-purple-200"}`}>
                            <p className={`font-mono-label text-[8px] uppercase font-bold tracking-wider mb-1 ${isDark ? "text-white/70" : "text-purple-900"}`}>
                              Choose Report Category:
                            </p>
                            <button
                              type="button"
                              onClick={() => handleCreateReport("💧 Solar Pump Failure", "Kilankwa Central Well", "#1fcfab")}
                              className={`w-full py-1.5 px-2 rounded-lg text-left text-[9px] font-mono-label font-semibold flex items-center justify-between border cursor-pointer ${isDark ? "bg-white/5 border-white/10 hover:bg-white/12 text-white" : "bg-white border-slate-200 hover:bg-purple-100 text-slate-900"}`}
                            >
                              <span>💧 Borehole Fault</span>
                              <span className="text-[7.5px] text-emerald-400 font-bold">+50 XP</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCreateReport("🗑️ Refuse Dump Spill", "Ashara Market Path", "#7c9ef8")}
                              className={`w-full py-1.5 px-2 rounded-lg text-left text-[9px] font-mono-label font-semibold flex items-center justify-between border cursor-pointer ${isDark ? "bg-white/5 border-white/10 hover:bg-white/12 text-white" : "bg-white border-slate-200 hover:bg-purple-100 text-slate-900"}`}
                            >
                              <span>🗑️ Refuse Heap Hazard</span>
                              <span className="text-[7.5px] text-blue-400 font-bold">+50 XP</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCreateReport("🚫 Blocked Gutter / Runoff", "Yangoji Bypass Drain", "#e8a94a")}
                              className={`w-full py-1.5 px-2 rounded-lg text-left text-[9px] font-mono-label font-semibold flex items-center justify-between border cursor-pointer ${isDark ? "bg-white/5 border-white/10 hover:bg-white/12 text-white" : "bg-white border-slate-200 hover:bg-purple-100 text-slate-900"}`}
                            >
                              <span>🚫 Blocked Drainage</span>
                              <span className="text-[7.5px] text-amber-400 font-bold">+50 XP</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPicker(false)}
                              className="w-full py-1 text-center font-mono-label text-[8px] uppercase tracking-wider text-white/40 hover:text-white cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        <p className={`font-mono-label text-[8px] tracking-widest uppercase pt-1 font-bold ${isDark ? "text-white/30" : "text-slate-500"}`}>
                          Recent Verified Feeds
                        </p>
                        {reports.map((r) => (
                          <div
                            key={r.id}
                            className={`flex items-center justify-between rounded-xl px-3 py-2.5 border transition-all ${
                              isDark ? "bg-white/5 border-white/6" : "bg-white border-slate-200"
                            }`}
                          >
                            <div>
                              <p className={`text-[11px] font-medium ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>{r.type}</p>
                              <p className={`font-mono-label text-[8px] ${isDark ? "text-white/25" : "text-slate-500"}`}>{r.loc}</p>
                            </div>
                            <span
                              className="font-mono-label text-[8px] px-2 py-0.5 rounded-full font-bold"
                              style={{ color: r.color, backgroundColor: `${r.color}20` }}
                            >
                              {r.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === "impact" && (
                      <div className="space-y-2.5">
                        <div
                          className={`border rounded-xl p-4 text-center ${
                            isDark
                              ? "bg-gradient-to-br from-[#1fcfab]/15 to-[#0fa88a]/8 border-[#1fcfab]/18"
                              : "bg-purple-50 border-purple-200"
                          }`}
                        >
                          <div className={`font-display text-4xl stat-glow ${isDark ? "text-[#1fcfab] font-light" : "text-purple-700 font-bold"}`}>
                            847
                          </div>
                          <p className={`font-mono-label text-[8px] tracking-widest uppercase mt-1 ${isDark ? "text-white/40" : "text-purple-900 font-bold"}`}>
                            Households Secured in Kilankwa
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { val: "24", label: "WASH Reports" },
                            { val: "19", label: "Resolved" },
                            { val: `${xp.toLocaleString()}`, label: "XP Earned" },
                            { val: "#3", label: "Council Rank" },
                          ].map((s) => (
                            <div
                              key={s.label}
                              className={`border rounded-xl p-3 text-center ${
                                isDark ? "bg-white/5 border-white/6" : "bg-white border-slate-200 shadow-xs"
                              }`}
                            >
                              <div className={`font-display text-2xl ${isDark ? "text-white font-light" : "text-slate-900 font-bold"}`}>
                                {s.val}
                              </div>
                              <p className={`font-mono-label text-[8px] uppercase tracking-wider ${isDark ? "text-white/25" : "text-slate-500 font-medium"}`}>
                                {s.label}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className={`border rounded-xl p-3 ${isDark ? "bg-white/5 border-white/6" : "bg-white border-slate-200 shadow-xs"}`}>
                          <p className={`font-mono-label text-[8px] uppercase tracking-wider mb-2 ${isDark ? "text-white/30" : "text-slate-600 font-medium"}`}>
                            XP to Master Guardian
                          </p>
                          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/8" : "bg-slate-100"}`}>
                            <div
                              className="h-full rounded-full fill-bar"
                              style={{
                                "--target-w": `${Math.min(100, Math.round((xp / 3000) * 100))}%`,
                                background: isDark
                                  ? "linear-gradient(90deg, #1fcfab, #7c9ef8)"
                                  : "linear-gradient(90deg, #7c3aed, #4f46e5)",
                              } as React.CSSProperties}
                            />
                          </div>
                          <p className={`font-mono-label text-[8px] mt-1.5 font-bold ${isDark ? "text-[#1fcfab]" : "text-purple-700"}`}>
                            {xp.toLocaleString()} / 3,000 XP
                          </p>
                        </div>
                      </div>
                    )}

                    {tab === "badges" && (
                      <div>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {BADGES.map((b) => (
                            <div
                              key={b.name}
                              className={`rounded-xl p-2.5 flex flex-col items-center text-center border transition-all duration-300 ${
                                b.earned
                                  ? isDark
                                    ? "bg-[#1fcfab]/8 border-[#1fcfab]/18 hover:bg-[#1fcfab]/15"
                                    : "bg-purple-50 border-purple-200 text-purple-900"
                                  : isDark
                                  ? "bg-white/3 border-white/6 opacity-35 grayscale"
                                  : "bg-slate-100 border-slate-200 opacity-40 grayscale"
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-xl mb-1.5 ${
                                  b.earned ? (isDark ? "bg-[#1fcfab]/18" : "bg-white shadow-xs") : "bg-white/5"
                                }`}
                              >
                                {b.icon}
                              </div>
                              <p className={`font-mono-label text-[8px] leading-tight ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                                {b.name}
                              </p>
                              {b.earned && (
                                <div className={`mt-1 w-1 h-1 rounded-full ${isDark ? "bg-[#1fcfab]" : "bg-purple-600"}`} />
                              )}
                            </div>
                          ))}
                        </div>
                        <div
                          className={`border rounded-xl p-3 flex items-center gap-2.5 ${
                            isDark ? "bg-[#1fcfab]/8 border-[#1fcfab]/18" : "bg-purple-50 border-purple-200"
                          }`}
                        >
                          <span className="text-xl">🏆</span>
                          <div>
                            <p className={`font-mono-label text-[8px] tracking-wider font-bold ${isDark ? "text-[#1fcfab]" : "text-purple-900"}`}>
                              Next: Master Guardian
                            </p>
                            <p className={`text-[9px] ${isDark ? "text-white/35" : "text-slate-600"}`}>
                              Verified reports earn community authority
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating notifications */}
              <div
                className={`absolute -right-16 top-16 rounded-2xl px-3.5 py-2.5 shadow-xl whitespace-nowrap ${
                  isDark
                    ? "bg-[#1fcfab] text-[#030810] shadow-[0_8px_32px_rgba(31,207,171,0.4)]"
                    : "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                }`}
                style={{ animation: "orb-drift-3 4s ease-in-out infinite" }}
              >
                <p className="font-mono-label text-[9px] font-bold">+120 XP earned! 🎉</p>
                <p className="font-mono-label text-[8px] opacity-75">Kilankwa report resolved</p>
              </div>
              <div
                className={`absolute -left-16 bottom-20 backdrop-blur-xl rounded-2xl px-3.5 py-2.5 shadow-2xl whitespace-nowrap border ${
                  isDark
                    ? "bg-[#0c1e36]/90 border-[#7c9ef8]/25 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
                    : "bg-white/95 border-purple-200 text-slate-900 shadow-lg"
                }`}
                style={{ animation: "orb-drift-2 5s ease-in-out infinite" }}
              >
                <p className={`font-mono-label text-[8px] font-bold ${isDark ? "text-[#7c9ef8]" : "text-purple-700"}`}>
                  🏅 Badge unlocked
                </p>
                <p className={`text-[11px] font-medium ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                  Village Voice
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OrgsSection() {
  const { isDark } = useTheme();
  const [activeStat, setActiveStat] = useState(0);
  const [activeDispatch, setActiveDispatch] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDispatch((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const dispatches = [
    {
      badge: "Critical Dispatch · Water Telemetry",
      title: "Solar Inverter Fault · Kilankwa Ward",
      color: "#f87070",
      aiSummary: "Gemini AI · Predictive Failure Alert",
      aiDetail: "3 pump cavitation risks predicted in 14 days (Kilankwa, Yangoji, Ashara). Preventive seal swap approved (₦280k) to prevent impact to ~2,400 households and save ₦3,520,000 in redrilling.",
      icon: "🧠",
    },
    {
      badge: "Scout Verified · Sanitation & Waste",
      title: "Refuse Heap & Gutter Blockage · Ashara Market",
      color: "#e8a94a",
      aiSummary: "Community Scout Grid · Rapid Clearance Order",
      aiDetail: "Scout photo verified: 140m drainage obstruction and illegal refuse buildup. Cleared with local youth sanitation brigade in 6 hours, safeguarding 3,100 market goers from flood contamination.",
      icon: "🗑️",
    },
  ];

  const kpis = [
    { label: "Water Quality", val: "87", unit: "/100", trend: "+12 this month", color: "#1fcfab", icon: "💧" },
    { label: "Pump Uptime", val: "98.4%", unit: "", trend: "↑ from 71%", color: "#7c9ef8", icon: "⚙️" },
    { label: "Waste Cleared", val: "33", unit: "/47", trend: "14 open hazards", color: "#e8a94a", icon: "🗑️" },
    { label: "Monitored Hubs", val: "42", unit: "", trend: "+8 in Gurara", color: "#c97ef8", icon: "🌐" },
  ];

  return (
    <section
      id="for-organizations"
      className={`relative py-32 overflow-hidden border-t ${
        isDark ? "bg-[#030810] border-white/6" : "bg-white border-purple-100"
      }`}
    >
      <div
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[50vw] h-[80vh]"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at right, rgba(124,158,248,0.06) 0%, transparent 65%)"
            : "radial-gradient(ellipse at right, rgba(79,70,229,0.05) 0%, transparent 65%)",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Dashboard Mockup */}
          <div className="relative reveal-left">
            <div className={`absolute inset-0 rounded-3xl blur-3xl ${isDark ? "bg-[#7c9ef8]/8" : "bg-purple-500/10"}`} />
            <div
              className={`relative backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ${
                isDark
                  ? "bg-gradient-to-b from-[#0c1e36]/95 to-[#071528]/95 border-white/8 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(124,158,248,0.08)]"
                  : "bg-white border-purple-200/80 shadow-[0_20px_50px_rgba(124,58,237,0.08)]"
              }`}
            >
              <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/6" : "border-purple-100 bg-purple-50/50"}`}>
                <div>
                  <p className={`font-mono-label text-[8px] tracking-widest uppercase font-bold ${isDark ? "text-white/30" : "text-purple-700"}`}>
                    AquaWatchAI · Institutional Command Console
                  </p>
                  <p className={`font-medium text-sm ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                    FCT RUWASSA / Kwali Water & Sanitation Authority · 42 Hubs
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${isDark ? "bg-[#1fcfab]/10 border-[#1fcfab]/25" : "bg-emerald-50 border-emerald-200"}`}>
                  <div className="relative w-2 h-2">
                    <div className={`w-2 h-2 rounded-full ${isDark ? "bg-[#1fcfab]" : "bg-emerald-500"}`} />
                    <div className={`ring-pulse absolute inset-0 rounded-full ${isDark ? "text-[#1fcfab]" : "text-emerald-500"}`} />
                  </div>
                  <span className={`font-mono-label text-[9px] font-bold uppercase ${isDark ? "text-[#1fcfab]" : "text-emerald-800"}`}>
                    Live
                  </span>
                </div>
              </div>

              {/* KPI Grid */}
              <div className={`grid grid-cols-4 border-b ${isDark ? "border-white/6" : "border-purple-100 bg-white"}`}>
                {kpis.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setActiveStat(i)}
                    className={`p-4 text-left border-r last:border-0 transition-all duration-300 cursor-pointer ${
                      isDark
                        ? `border-white/6 ${activeStat === i ? "bg-white/5" : "hover:bg-white/3"}`
                        : `border-purple-100 ${activeStat === i ? "bg-purple-50/80" : "hover:bg-purple-50/40"}`
                    }`}
                  >
                    <span className="text-base">{s.icon}</span>
                    <div
                      className={`font-display text-xl mt-2 ${
                        isDark ? "font-light" : "font-bold text-slate-900"
                      }`}
                      style={{ color: isDark ? s.color : undefined }}
                    >
                      {s.val}
                      <span className="text-sm opacity-50">{s.unit}</span>
                    </div>
                    <p className={`font-mono-label text-[7px] uppercase tracking-wider mt-0.5 truncate ${isDark ? "text-white/30" : "text-slate-500 font-semibold"}`}>
                      {s.label}
                    </p>
                    {activeStat === i && (
                      <div className="mt-2 h-px rounded-full" style={{ backgroundColor: s.color }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Map view */}
              <div className="relative h-44 overflow-hidden bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1776090416729-20bedcc1a207?w=800&h=280&fit=crop&auto=format"
                  alt="Aerial rural landscape"
                  className="w-full h-full object-cover opacity-35"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    isDark ? "from-[#071528]" : "from-slate-900/80"
                  } via-transparent to-transparent`}
                />
                {[
                  { x: "22%", y: "45%", c: "#1fcfab", p: true },
                  { x: "43%", y: "28%", c: "#e8a94a", p: true },
                  { x: "58%", y: "58%", c: "#1fcfab", p: true },
                  { x: "70%", y: "32%", c: "#f87070", p: true },
                  { x: "36%", y: "68%", c: "#1fcfab", p: false },
                  { x: "78%", y: "62%", c: "#7c9ef8", p: false },
                ].map((pin, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full shadow-lg"
                    style={{
                      left: pin.x,
                      top: pin.y,
                      backgroundColor: pin.c,
                      boxShadow: `0 0 10px ${pin.c}90`,
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    {pin.p && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-50"
                        style={{ backgroundColor: pin.c }}
                      />
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setActiveDispatch((p) => (p === 0 ? 1 : 0))}
                  className={`absolute top-3 right-3 rounded-xl px-3 py-2 backdrop-blur-md text-left transition-all duration-300 border cursor-pointer ${
                    activeDispatch === 0
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300 shadow-lg shadow-rose-950/30"
                      : "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-lg shadow-amber-950/30"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-ping"
                      style={{ backgroundColor: activeDispatch === 0 ? "#f43f5e" : "#f59e0b" }}
                    />
                    <p className="font-mono-label text-[7px] tracking-widest uppercase font-bold">
                      {dispatches[activeDispatch].badge}
                    </p>
                  </div>
                  <p className="text-white text-[11px] font-medium mt-0.5">
                    {dispatches[activeDispatch].title}
                  </p>
                </button>
              </div>

              {/* Alert card */}
              <div className={`px-5 py-4 border-t transition-colors duration-300 ${isDark ? "border-white/6" : "border-purple-100 bg-purple-50/70"}`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7c9ef8]/15 flex items-center justify-center flex-shrink-0 text-sm">
                    {dispatches[activeDispatch].icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-mono-label text-[8px] tracking-widest uppercase font-bold ${isDark ? "text-[#7c9ef8]" : "text-purple-800"}`}>
                        {dispatches[activeDispatch].aiSummary}
                      </p>
                      <span className={`text-[8px] px-1.5 py-0.2 rounded font-mono ${isDark ? "bg-white/10 text-white/60" : "bg-purple-200 text-purple-900"}`}>
                        Tap map badge to toggle
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDark ? "text-white/65" : "text-slate-700"}`}>
                      {dispatches[activeDispatch].aiDetail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div>
            <div
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-7 reveal border ${
                isDark
                  ? "bg-[#7c9ef8]/10 border-[#7c9ef8]/18 text-[#7c9ef8]"
                  : "bg-purple-50 border-purple-200 text-purple-800 font-bold"
              }`}
            >
              <span className="text-sm">🏢</span>
              <span className="font-mono-label text-[10px] tracking-widest uppercase font-semibold">
                For State Water Boards, RUWASSA & Donors
              </span>
            </div>
            <h2 className="font-display font-light leading-[0.95] mb-7 reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl">
              <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                Stop flying blind.
              </span>
              <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                Know before
              </span>
              <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
                it breaks.
              </span>
            </h2>
            <p className={`text-lg leading-relaxed mb-10 reveal reveal-delay-2 font-light ${isDark ? "text-white/40" : "text-slate-600"}`}>
              A real-time command center for rural WASH. Predict failures. Allocate resources where they matter. Prove impact to funders with live data.
            </p>

            <div className="space-y-4 reveal reveal-delay-3">
              {[
                {
                  icon: "🌐",
                  title: "Digital Twin of every community borehole",
                  desc: "Test pump & aquifer interventions virtually before committing budget or sending crews into the field.",
                },
                {
                  icon: "🗑️",
                  title: "Community-Led Sanitation & Waste Grid",
                  desc: "Scout-verified geo-tagged reporting on open refuse dumps and drainage blockages with zero IoT overhead.",
                },
                {
                  icon: "🔮",
                  title: "Predict failures 14 days out",
                  desc: "Acoustic pattern AI flags water infrastructure degradation before taps run dry.",
                },
                {
                  icon: "📊",
                  title: "Funder-ready live dashboards",
                  desc: "Auto-generated reports showing verified WASH and waste clearance metrics, uptime, and households served.",
                },
                {
                  icon: "🔗",
                  title: "API-first, integrates with your stack",
                  desc: "REST APIs, WhatsApp bot connectors, SMS alerts, and full PostgreSQL data access.",
                },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-4 group cursor-default">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-all duration-300 border ${
                      isDark
                        ? "bg-[#7c9ef8]/8 border-[#7c9ef8]/15 group-hover:bg-[#7c9ef8]/18 group-hover:scale-110"
                        : "bg-purple-50 border-purple-200 group-hover:bg-purple-100 group-hover:scale-105"
                    }`}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h4
                      className={`mb-0.5 transition-colors duration-200 ${
                        isDark
                          ? "text-white font-medium group-hover:text-[#7c9ef8]"
                          : "text-slate-900 font-bold group-hover:text-purple-700"
                      }`}
                    >
                      {f.title}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-white/30" : "text-slate-600"}`}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 reveal reveal-delay-3">
              <Link
                href="/institutional"
                className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-bold transition-all shadow-lg ${
                  isDark
                    ? "bg-[#1fcfab] text-[#030810] hover:bg-[#1ab898]"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                <span>Launch RUWASSA Command Console</span>
                <span>→</span>
              </Link>
              <Link
                href="/signup?role=institutional"
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-semibold border transition-all ${
                  isDark
                    ? "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    : "bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200"
                }`}
              >
                Request Agency Access
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  const { isDark } = useTheme();
  const parallaxRef = useParallax(0.15);

  return (
    <section
      id="impact"
      className={`relative py-32 overflow-hidden border-t ${
        isDark ? "bg-[#030810] border-white/6" : "bg-white border-purple-100"
      }`}
    >
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={parallaxRef} className="absolute inset-[-10%] will-change-transform opacity-15">
          <img
            src="https://images.unsplash.com/photo-1776090416729-20bedcc1a207?w=1800&h=900&fit=crop&auto=format"
            alt="Aerial landscape"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(180deg, #030810 0%, rgba(3,8,16,0.6) 50%, #030810 100%)"
              : "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 50%, #ffffff 100%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[10px] font-semibold tracking-widest uppercase mb-4 reveal border ${
              isDark
                ? "bg-[#1fcfab]/10 border-[#1fcfab]/25 text-[#1fcfab]"
                : "bg-purple-50 border-purple-200 text-purple-800"
            }`}
          >
            Measurable SDG 6 Impact
          </div>
          <h2 className="font-display font-light leading-[0.95] reveal reveal-delay-1 text-4xl md:text-5xl lg:text-6xl">
            <span className={`block ${isDark ? "text-white" : "text-slate-900 font-bold"}`}>
              What happens when
            </span>
            <span
              className="block"
              style={{
                background: isDark
                  ? "linear-gradient(135deg,#1fcfab,#7c9ef8)"
                  : "linear-gradient(135deg,#7c3aed,#4f46e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              communities become data
            </span>
          </h2>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            {
              val: "42",
              unit: "Hubs Monitored",
              desc: "Across Kwali & Gurara",
              color: isDark ? "#1fcfab" : "#7c3aed",
            },
            {
              val: "98.4%",
              unit: "Pump Uptime",
              desc: "Up from 71% baseline",
              color: isDark ? "#7c9ef8" : "#059669",
            },
            {
              val: "4h",
              unit: "Avg Response",
              desc: "Down from 3 months",
              color: isDark ? "#e8a94a" : "#d97706",
            },
            {
              val: "86,000+",
              unit: "People Protected",
              desc: "Safe water & waste cleared",
              color: isDark ? "#c97ef8" : "#4f46e5",
            },
          ].map((s, i) => (
            <div
              key={s.unit}
              className={`card-lift rounded-2xl p-6 text-center reveal reveal-delay-${i + 1} border transition-all duration-300 ${
                isDark
                  ? "bg-white/4 backdrop-blur border-white/8 hover:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "bg-white border-purple-200/80 shadow-[0_4px_20px_rgba(124,58,237,0.06)] hover:border-purple-400"
              }`}
            >
              <div
                className="font-display text-4xl md:text-5xl mb-1"
                style={{
                  color: s.color,
                  textShadow: isDark ? `0 0 35px ${s.color}40` : undefined,
                  fontWeight: isDark ? 300 : 700,
                }}
              >
                {s.val}
              </div>
              <div
                className="font-mono-label text-[10px] tracking-widest uppercase mb-1.5 font-bold"
                style={{ color: isDark ? `${s.color}cc` : s.color }}
              >
                {s.unit}
              </div>
              <p className={`text-xs ${isDark ? "text-white/35" : "text-slate-500"}`}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 3 Field Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "I reported the rattling noise at our solar pump in Kilankwa at 7:15 AM. By 2:15 PM, the technician arrived with the exact seal and water was flowing again. The whole village was relieved.",
              name: "Amina Bello",
              role: "Community Water Guardian · Kilankwa Ward, Kwali",
              initials: "AB",
            },
            {
              quote:
                "The digital twin predicted 3 pump failures before the impellers ground to powder. We avoided emergency redrilling contracts and redirected ₦1.8B in state funds into new pipe extensions.",
              name: "Engr. Babatunde Lawal",
              role: "Chief WASH Operations Officer · FCT RUWASSA",
              initials: "BL",
            },
            {
              quote:
                "Our council leaders now see live borehole uptime dashboards instead of waiting 18 months for survey books. It turns water repair into a transparent, measurable public service.",
              name: "Danladi Ibrahim",
              role: "Lead Scout Coordinator · Kwali Area Council",
              initials: "DI",
            },
          ].map((t, i) => (
            <div
              key={t.name}
              className={`card-lift rounded-2xl p-6 flex flex-col justify-between space-y-4 reveal reveal-delay-${i + 2} border transition-all duration-300 ${
                isDark
                  ? "bg-white/4 backdrop-blur border-white/8 hover:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "bg-white border-purple-200/80 hover:border-purple-400 shadow-sm"
              }`}
            >
              <p
                className={`font-display text-base italic leading-relaxed ${
                  isDark ? "font-light text-white/75" : "font-normal text-slate-700"
                }`}
              >
                "{t.quote}"
              </p>
              <div className={`flex items-center gap-3 pt-3 border-t ${isDark ? "border-white/8" : "border-purple-100"}`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-xs ${
                    isDark
                      ? "bg-gradient-to-tr from-[#1fcfab] to-[#7c9ef8] text-[#030810]"
                      : "bg-gradient-to-tr from-purple-600 to-indigo-600 text-white"
                  }`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className={`text-sm ${isDark ? "text-white font-medium" : "text-slate-900 font-bold"}`}>
                    {t.name}
                  </p>
                  <p
                    className={`font-mono-label text-[9px] ${
                      isDark ? "text-[#1fcfab] tracking-wider" : "text-purple-700 font-medium"
                    }`}
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Join() {
  const { isDark } = useTheme();

  const cards = [
    {
      emoji: "🏡",
      tag: "Community Scout",
      tagColor: isDark ? "#1fcfab" : "#7c3aed",
      headline: ["I'm a community", "member / scout"],
      desc: "Report borehole breakdowns, earn badges, track clean water restoration, and protect your village.",
      perks: [
        "Free to join, always",
        "Report with just your mobile phone",
        "Earn XP points & Guardian badges",
        "See repairs verified on ground",
      ],
      cta: "Join as Community Scout →",
      href: "/signup?role=community",
      btnBg: isDark ? "#1fcfab" : "#7c3aed",
      btnText: isDark ? "#030810" : "#ffffff",
      glow: "rgba(31,207,171,0.15)",
      border: isDark ? "rgba(31,207,171,0.2)" : "rgba(124,58,237,0.3)",
      hoverBorder: isDark ? "rgba(31,207,171,0.5)" : "rgba(124,58,237,0.6)",
      perkColor: isDark ? "#1fcfab" : "#7c3aed",
    },
    {
      emoji: "🏢",
      tag: "RUWASSA / NGO / Donor",
      tagColor: isDark ? "#7c9ef8" : "#4f46e5",
      headline: ["I represent a state", "water authority / NGO"],
      desc: "Deploy across local government wards. Predict pump failures. Eliminate blind spots. Verify SDG 6 impact.",
      perks: [
        "14-day institutional pilot",
        "Onboard entire council area in hours",
        "AI failure predictions & digital twin",
        "Live funder & public dashboards",
      ],
      cta: "Start Institutional Pilot →",
      href: "/signup?role=institutional",
      btnBg: isDark ? "#7c9ef8" : "#4f46e5",
      btnText: isDark ? "#030810" : "#ffffff",
      glow: "rgba(124,158,248,0.12)",
      border: isDark ? "rgba(124,158,248,0.2)" : "rgba(79,70,229,0.3)",
      hoverBorder: isDark ? "rgba(124,158,248,0.5)" : "rgba(79,70,229,0.6)",
      perkColor: isDark ? "#7c9ef8" : "#4f46e5",
    },
  ];

  return (
    <section
      id="join"
      className={`relative py-32 overflow-hidden border-t ${
        isDark ? "bg-[#030810] border-white/6" : "bg-white border-purple-100"
      }`}
    >
      {/* Background center orb */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="w-[80vw] h-[60vh] max-w-[1000px] orb-2"
          style={{
            background: isDark
              ? "radial-gradient(ellipse, rgba(31,207,171,0.05) 0%, transparent 70%)"
              : "radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 reveal">
          <h2 className="font-display leading-[0.95] mb-3 text-4xl md:text-5xl">
            <span className={`block ${isDark ? "font-light text-white" : "font-bold text-slate-900"}`}>
              Which best describes you?
            </span>
          </h2>
          <p className={`text-base ${isDark ? "text-white/35" : "text-slate-600"}`}>
            Both onboarding paths take under 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cards.map((card, i) => (
            <div
              key={card.tag}
              className={`group relative rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 reveal reveal-delay-${i + 1} ${
                isDark
                  ? "bg-gradient-to-b from-[#0c1e36]/85 to-[#07131f]/85 shadow-[0_0_50px_rgba(0,0,0,0.6)]"
                  : "bg-white shadow-[0_10px_35px_rgba(124,58,237,0.08)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.16)]"
              }`}
              style={{
                border: `1px solid ${card.border}`,
                boxShadow: isDark ? `0 0 50px ${card.glow}, inset 0 1px 0 rgba(255,255,255,0.05)` : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = card.hoverBorder;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = card.border;
              }}
            >
              {isDark && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top, ${card.glow} 0%, transparent 70%)` }}
                />
              )}
              <div className="relative">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-300 group-hover:scale-110 border ${
                    isDark ? "bg-white/5 border-white/10" : "bg-purple-50 border-purple-200"
                  }`}
                >
                  {card.emoji}
                </div>
                <div
                  className="font-mono-label text-[10px] tracking-widest uppercase mb-2 font-bold"
                  style={{ color: card.tagColor }}
                >
                  {card.tag}
                </div>
                <h3
                  className={`font-display text-3xl leading-tight mb-3 ${
                    isDark ? "font-light text-white" : "font-bold text-slate-900"
                  }`}
                >
                  {card.headline[0]}
                  <br />
                  {card.headline[1]}
                </h3>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? "text-white/40" : "text-slate-600"}`}>
                  {card.desc}
                </p>
                <div className="space-y-2.5 mb-8">
                  {card.perks.map((p) => (
                    <div key={p} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${card.perkColor}20`,
                        }}
                      >
                        <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3">
                          <path
                            d="M3.5 7l2.5 2.5 4.5-4.5"
                            stroke={card.perkColor}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className={`text-sm ${isDark ? "text-white/60" : "text-slate-700 font-medium"}`}>
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  href={card.href}
                  className="block text-center w-full py-4 rounded-xl font-mono-label text-[11px] tracking-widest uppercase font-bold transition-all shadow-md cursor-pointer hover:opacity-95"
                  style={{
                    backgroundColor: card.btnBg,
                    color: card.btnText,
                    boxShadow: `0 8px 24px ${card.btnBg}35`,
                  }}
                >
                  {card.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { isDark } = useTheme();

  return (
    <footer
      className={`border-t py-14 transition-colors duration-500 ${
        isDark ? "bg-[#030810] border-white/6" : "bg-slate-50 border-purple-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-md ${
                  isDark
                    ? "bg-gradient-to-br from-[#1fcfab] to-[#0d8a73]"
                    : "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                }`}
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <circle cx="8" cy="8" r="3" fill="white" />
                  <circle
                    cx="8"
                    cy="8"
                    r="6"
                    stroke="white"
                    strokeWidth="0.8"
                    strokeDasharray="2 1.5"
                    opacity="0.75"
                  />
                </svg>
              </div>
              <span className={`font-display font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>
                AquaWatch
                <span className={isDark ? "text-[#1fcfab]" : "text-purple-600"}>AI</span>
                <span
                  className={`ml-1.5 text-[9px] font-mono-label font-normal px-1.5 py-0.5 rounded border ${
                    isDark
                      ? "text-[#1fcfab] bg-[#1fcfab]/10 border-[#1fcfab]/30"
                      : "text-purple-700 bg-purple-50 border-purple-200"
                  }`}
                >
                  Kwali
                </span>
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-xs ${isDark ? "text-white/35" : "text-slate-600"}`}>
              Continuous Cyber-Physical WASH Intelligence & Digital Twin for rural Nigerian water security. Localized to Kwali Area Council FCT.
            </p>
          </div>

          {[
            {
              title: "Platform",
              links: ["How It Works", "For Communities", "For Organizations", "SDG 6 Impact"],
            },
            {
              title: "Technology",
              links: ["IoT Sensors", "Gemini AI", "Hydrodynamic Twin", "pgvector Memory"],
            },
            {
              title: "Governance",
              links: ["FCT RUWASSA", "Kwali Area Council", "Community Mesh", "Security & Privacy"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p
                className={`font-mono-label text-[10px] tracking-widest uppercase mb-3 font-bold ${
                  isDark ? "text-[#1fcfab]" : "text-purple-800"
                }`}
              >
                {col.title}
              </p>
              <div className="space-y-2">
                {col.links.map((l) => (
                  <p
                    key={l}
                    className={`font-mono-label text-[11px] cursor-pointer transition-colors duration-150 font-medium ${
                      isDark
                        ? "text-white/40 hover:text-white"
                        : "text-slate-600 hover:text-purple-700"
                    }`}
                  >
                    {l}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className={`border-t pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
            isDark ? "border-white/6" : "border-purple-200/80"
          }`}
        >
          <p className={`font-mono-label text-[10px] font-medium ${isDark ? "text-white/30" : "text-slate-500"}`}>
            © 2026 AquaWatchAI · KwaliHub · Kwali Area Council FCT, Nigeria
          </p>
          <p className={`font-mono-label text-[10px] font-medium ${isDark ? "text-white/30" : "text-slate-500"}`}>
            UN SDG 6 Standard · Verified Community Ground Truth
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("aquawatch-theme") as "dark" | "light" | null;
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("aquawatch-theme", next);
      } catch (_) {}
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  useReveal();

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      <main
        className={`min-h-full transition-colors duration-500 ${
          isDark
            ? "bg-[#030810] text-white selection:bg-[#1fcfab] selection:text-[#030810]"
            : "bg-white text-slate-900 selection:bg-purple-600 selection:text-white"
        }`}
      >
        <AmbientOrbs />
        <Nav />
        <Hero />
        <Ticker />
        <Stakes />
        <Pipeline />
        <CommunitySection />
        <OrgsSection />
        <Impact />
        <Join />
        <Footer />
      </main>
    </ThemeContext.Provider>
  );
}
