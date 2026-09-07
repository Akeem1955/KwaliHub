"use client";
import { motion, useReducedMotion } from "framer-motion";

const features = [
  {
    title: "IoT Sensors",
    desc: "Low-cost hardware mapping real-time infrastructure conditions.",
    span: "md:col-span-1 md:row-span-1",
    bg: "bg-slate-900",
  },
  {
    title: "Community Reporting",
    desc: "Citizen-generated data via Google Maps.",
    span: "md:col-span-1 md:row-span-1",
    bg: "bg-slate-900",
  },
  {
    title: "pgvector Memory",
    desc: "High-dimensional community indexing.",
    span: "md:col-span-1 md:row-span-1",
    bg: "bg-slate-900",
  },
  {
    title: "Gemini 3.8 Flash",
    desc: "Generative AI engine analyzing evolving data to identify emerging problems and synthesize context-specific interventions.",
    span: "md:col-span-3 md:row-span-1 lg:col-span-3",
    bg: "bg-blue-900/20 border border-blue-500/20",
  }
];

export function BentoFramework() {
  const reduce = useReducedMotion();
  
  return (
    <section className="w-full bg-slate-950 py-32 md:py-48 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-16">
          The Architecture
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 grid-flow-dense">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduce ? {} : { scale: 1.02 }}
              className={`group relative overflow-hidden rounded-3xl p-8 transition-colors ${feature.bg} ${feature.span}`}
            >
              <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed max-w-3xl">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
