"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { id: "01", title: "Data Collection", desc: "IoT and citizen reports merge in real-time." },
  { id: "02", title: "AI Analysis", desc: "Gemini identifies emerging WASH problems." },
  { id: "03", title: "Simulation", desc: "Evaluate strategies before practical implementation." },
  { id: "04", title: "Continuous Update", desc: "The Digital Twin reflects real-world impact." }
];

export function FeedbackCycleStack() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      const cardEls = gsap.utils.toArray<HTMLElement>(".stack-card");
      cardEls.forEach((card, i) => {
        if (i === cardEls.length - 1) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cardEls[cardEls.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.92,
          opacity: 0.25,
          ease: "none",
          scrollTrigger: {
            trigger: cardEls[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section className="bg-slate-950 pt-24 pb-32">
      <div ref={ref} className="relative mx-auto max-w-4xl px-6">
        <div className="mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
            The Feedback Cycle
          </h2>
        </div>
        {steps.map((step, i) => (
          <div
            key={i}
            className="stack-card sticky top-0 min-h-[100dvh] flex items-center justify-center pt-24 pb-24"
          >
            <div className="w-full rounded-[2.5rem] border border-slate-800 bg-slate-900/80 p-12 md:p-20 backdrop-blur-md shadow-2xl">
              <div className="text-blue-500 font-mono text-sm mb-6 uppercase tracking-widest">{step.id}</div>
              <h3 className="text-3xl md:text-5xl font-medium text-white mb-6 tracking-tight">
                {step.title}
              </h3>
              <p className="text-xl text-slate-400 max-w-lg">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
