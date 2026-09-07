"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-4 py-3 sm:py-3.5 bg-white/85 backdrop-blur-xl border-b border-purple-100/80">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="flex items-center justify-between gap-6 rounded-full border border-purple-200/80 bg-white/95 px-4 py-1.5 shadow-[0_4px_25px_rgba(124,58,237,0.08)] sm:gap-8 sm:px-6 w-full max-w-6xl"
      >
        {/* Brand Monogram */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-tight text-slate-900">
              WASH·Twin
            </span>
            <span className="text-xs font-medium text-purple-600">
              Cyber-Physical Hydrology
            </span>
          </div>
        </a>

        {/* Navigation Anchors */}
        <div className="hidden items-center gap-6 text-xs font-medium text-slate-600 md:flex">
          <a
            href="#console"
            className="transition-colors hover:text-purple-600"
          >
            GIS Hydrology Twin
          </a>
          <a
            href="#architecture"
            className="transition-colors hover:text-purple-600"
          >
            Digital Twin Core
          </a>
          <a
            href="#portals"
            className="transition-colors hover:text-purple-600"
          >
            Dual Portals
          </a>
          <a
            href="#gamification"
            className="transition-colors hover:text-purple-600"
          >
            Community Loop
          </a>
          <a
            href="#institutional"
            className="transition-colors hover:text-purple-600"
          >
            Vetted Access
          </a>
        </div>

        {/* Gated Action */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            className="!px-4 !py-1.5 !text-xs !rounded-full"
            onClick={() => {
              const el = document.getElementById("institutional");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Institutional Portal
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
              ↗
            </span>
          </Button>
        </div>
      </motion.nav>
    </header>
  );
}
