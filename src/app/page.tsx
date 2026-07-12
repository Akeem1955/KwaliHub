'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, Droplets, Wifi, BrainCircuit, RotateCcw, ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   Reusable scroll-triggered section wrapper
   ───────────────────────────────────────────── */
function StorySection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─────────────────────────────────────────────
   Stat counter that animates on scroll
   ───────────────────────────────────────────── */
function StatBlock({ value, label, suffix = '' }: { value: string; label: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">
        {value}<span className="text-blue-400">{suffix}</span>
      </div>
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-bold mt-2">{label}</div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════ */
export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div className="bg-[#0B0C10] text-slate-200 font-sans overflow-x-hidden">

      {/* ═══════════════════════════════════════
          HERO — Full-screen cinematic opener
          ═══════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
          <Image
            src="/story/crisis.png"
            alt="Kwali village landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0C10]/70 via-[#0B0C10]/40 to-[#0B0C10]" />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">Kwali Area Council, Abuja — Nigeria</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              See How We Want<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">To Solve It</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              A generative AI-powered digital twin that transforms broken rural water infrastructure into self-sustaining community enterprises.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col items-center"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500 font-bold mb-4">Scroll to begin the story</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <ArrowDown size={20} className="text-slate-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          ACT 1 — THE CRISIS
          ═══════════════════════════════════════ */}
      <div className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">

          <StorySection>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-[2px] bg-red-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-red-400">Act 1 — The Broken Loop</span>
            </div>
          </StorySection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <StorySection>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-8">
                The pump breaks.<br />
                <span className="text-red-400">Nobody comes back.</span>
              </h2>

              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  Meet <strong className="text-white">Amina</strong> and her neighbors in Kwali. Every day, their community depends on a single water point. But traditional interventions follow a tragic, repeating script.
                </p>
                <p>
                  An NGO installs a pump and walks away. Within 18 months, the infrastructure fails. The community has no savings for repairs. Local technicians lack the parts. Families return to contaminated streams.
                </p>
                <p className="text-red-300/80 border-l-2 border-red-500/50 pl-6 italic">
                  This is the &ldquo;scourge of non-functional infrastructure&rdquo; — and it affects 30% of all rural water points across Sub-Saharan Africa.
                </p>
              </div>
            </StorySection>

            <StorySection className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(220,38,38,0.15)]">
                <Image
                  src="/story/crisis.png"
                  alt="Broken water infrastructure in a rural village"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-red-950/60 backdrop-blur-md border border-red-500/30 rounded-xl px-5 py-4">
                    <div className="flex items-center space-x-2 text-red-400 mb-1">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Infrastructure Status</span>
                    </div>
                    <span className="text-2xl font-black text-red-300">0% Functional</span>
                  </div>
                </div>
              </div>
            </StorySection>
          </div>

          {/* Crisis Stats */}
          <StorySection className="mt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-slate-800/50 pt-12">
              <StatBlock value="30" suffix="%" label="Pumps Non-Functional" />
              <StatBlock value="18" suffix="mo" label="Average Lifespan" />
              <StatBlock value="0" suffix="" label="Revenue Generated" />
              <StatBlock value="∞" suffix="" label="Donor Dependency" />
            </div>
          </StorySection>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          ACT 2 — THE SENSING LAYER
          ═══════════════════════════════════════ */}
      <div className="relative py-32 px-6 bg-gradient-to-b from-[#0B0C10] via-[#080B14] to-[#0B0C10]">
        <div className="max-w-6xl mx-auto">

          <StorySection>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-[2px] bg-blue-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">Act 2 — The Sensing Layer</span>
            </div>
          </StorySection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <StorySection className="order-2 lg:order-1 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(59,130,246,0.15)]">
                <Image
                  src="/story/twin.png"
                  alt="Digital twin holographic network visualization"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-blue-950/60 backdrop-blur-md border border-blue-500/30 rounded-xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-blue-400 mb-1">
                        <Wifi size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Live Telemetry</span>
                      </div>
                      <span className="text-xl font-black text-blue-300">15 Nodes Active</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Accuracy</span>
                      <span className="text-xl font-black text-emerald-400">80%+</span>
                    </div>
                  </div>
                </div>
              </div>
            </StorySection>

            <StorySection className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-8">
                We don&apos;t build another pump.<br />
                <span className="text-blue-400">We build a brain.</span>
              </h2>

              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  Using initial funding, Kwali Council deploys a network of <strong className="text-white">15 low-cost, solar-powered IoT sensors</strong> across strategic water points.
                </p>
                <p>
                  Simultaneously, local volunteers are trained as <strong className="text-white">Citizen Scientists</strong>, armed with a mobile interface to feed real-time human insights into the system — issues that hardware alone can&apos;t detect.
                </p>
                <p>
                  Together, they power a <strong className="text-blue-300">WASH Digital Twin</strong> — a living virtual replica of every water point in the council. Flow rate, energy usage, water quality, pump status — all monitored 24/7.
                </p>
              </div>

              {/* Mini feature cards */}
              <div className="grid grid-cols-2 gap-4 mt-10">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <Droplets size={20} className="text-blue-400 mb-2" />
                  <span className="text-sm font-bold text-slate-300 block">Flow Rate</span>
                  <span className="text-xs text-slate-500">Real-time L/min tracking</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <Wifi size={20} className="text-emerald-400 mb-2" />
                  <span className="text-sm font-bold text-slate-300 block">Pump Status</span>
                  <span className="text-xs text-slate-500">OPERATIONAL / DEGRADED / BROKEN</span>
                </div>
              </div>
            </StorySection>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          ACT 3 — THE AI ENGINE
          ═══════════════════════════════════════ */}
      <div className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">

          <StorySection>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-[2px] bg-purple-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-purple-400">Act 3 — The AI Engine</span>
            </div>
          </StorySection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <StorySection>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-8">
                AI doesn&apos;t guess.<br />
                <span className="text-purple-400">It generates a custom plan.</span>
              </h2>

              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  The <strong className="text-white">Generative AI Engine (Gemini 2.5)</strong> analyzes the unique data signature of each community — its population density, solar profile, seasonal revenue patterns, and economic activity.
                </p>
                <p>
                  It then automatically generates a <strong className="text-purple-300">tailored micro-business model</strong> for the local steward from 8 approved revenue strategies:
                </p>
              </div>

              {/* Business model grid */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                {[
                  'Pay-per-fetch metering',
                  'Treated water resale',
                  'Bulk delivery service',
                  'Bundled hygiene retail',
                  'Agricultural water sales',
                  'Solar phone charging',
                  'Cooperative membership',
                  'Maintenance subcontracting',
                ].map((model) => (
                  <div key={model} className="flex items-center space-x-2 bg-purple-500/5 border border-purple-500/20 rounded-lg px-3 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span className="text-xs font-medium text-slate-300">{model}</span>
                  </div>
                ))}
              </div>
            </StorySection>

            <StorySection className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.15)]">
                <Image
                  src="/story/hub.png"
                  alt="Solar-powered water kiosk micro-business hub"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-purple-950/60 backdrop-blur-md border border-purple-500/30 rounded-xl px-5 py-4">
                    <div className="flex items-center space-x-2 text-purple-400 mb-1">
                      <BrainCircuit size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Gemini 2.5 Output</span>
                    </div>
                    <span className="text-sm font-medium text-purple-200">
                      &ldquo;Solar phone charging add-on: Leverage excess solar capacity to offer ₦50/charge. Estimated ₦2,500/day additional revenue.&rdquo;
                    </span>
                  </div>
                </div>
              </div>

              {/* Transformation callout */}
              <StorySection className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-8">
                <p className="text-slate-400 text-sm leading-relaxed">
                  <strong className="text-emerald-400 text-base block mb-2">Amina&apos;s transformation:</strong>
                  She is no longer just fetching water. She is managing a <strong className="text-white">subsidized, tech-driven franchise asset</strong>. She charges a tiny, affordable fee for water, ice, and power. The water is her raw material; the services create her cash flow.
                </p>
              </StorySection>
            </StorySection>
          </div>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          ACT 4 — THE CLOSED LOOP
          ═══════════════════════════════════════ */}
      <div className="relative py-32 px-6 bg-gradient-to-b from-[#0B0C10] via-[#081410] to-[#0B0C10]">
        <div className="max-w-6xl mx-auto">

          <StorySection>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-8 h-[2px] bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Act 4 — The Closed Loop</span>
            </div>
          </StorySection>

          <StorySection>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-8 max-w-3xl">
              The system detects failure<br />
              <span className="text-emerald-400">before the community does.</span>
            </h2>
          </StorySection>

          {/* The loop visualization */}
          <StorySection className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Anomaly Detected',
                  desc: 'IoT sensor detects flow rate dropping below threshold. Pump status shifts to DEGRADED.',
                  color: 'text-amber-400',
                  border: 'border-amber-500/30',
                  bg: 'bg-amber-500/5',
                  icon: Wifi,
                },
                {
                  step: '02',
                  title: 'AI Reroutes',
                  desc: 'Gemini generates a temporary business model pivot and SMS nudges to redirect households.',
                  color: 'text-purple-400',
                  border: 'border-purple-500/30',
                  bg: 'bg-purple-500/5',
                  icon: BrainCircuit,
                },
                {
                  step: '03',
                  title: 'Steward Dispatched',
                  desc: 'The local steward receives a maintenance alert with a pre-generated diagnostic report.',
                  color: 'text-blue-400',
                  border: 'border-blue-500/30',
                  bg: 'bg-blue-500/5',
                  icon: Droplets,
                },
                {
                  step: '04',
                  title: 'Loop Closes',
                  desc: 'Sensor confirms repair. Revenue stream normalizes. Community never lost access to water.',
                  color: 'text-emerald-400',
                  border: 'border-emerald-500/30',
                  bg: 'bg-emerald-500/5',
                  icon: RotateCcw,
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className={`${item.bg} border ${item.border} rounded-2xl p-6 relative group hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] transition-shadow`}
                >
                  {/* Connector line */}
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-slate-800" />
                  )}
                  <span className={`text-3xl font-black font-mono ${item.color} opacity-30 block mb-4`}>{item.step}</span>
                  <item.icon size={20} className={`${item.color} mb-3`} />
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </StorySection>

          {/* Sensor close-up */}
          <StorySection className="mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.15)]">
                <Image
                  src="/story/sensor.png"
                  alt="IoT sensor module embedded in water infrastructure"
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent" />
              </div>

              <div className="space-y-6">
                <p className="text-lg text-slate-400 leading-relaxed">
                  This is how sustainability works. <strong className="text-white">No more donor dependency.</strong> The system monitors itself, the AI adapts in real-time, and the community steward is empowered — not abandoned.
                </p>
                <p className="text-lg text-slate-400 leading-relaxed">
                  The digital twin creates a <strong className="text-emerald-300">risk-free sandbox</strong> where every intervention is tested virtually before being deployed in the real world. The result: <strong className="text-white">measurable, repeatable, scalable impact</strong>.
                </p>

                {/* Final Stats */}
                <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-slate-800/50">
                  <StatBlock value="24/7" label="Autonomous Monitoring" />
                  <StatBlock value="₦0" label="Donor Dependency" />
                </div>
              </div>
            </div>
          </StorySection>
        </div>
      </div>


      {/* ═══════════════════════════════════════
          CALL TO ACTION — Enter the Simulation
          ═══════════════════════════════════════ */}
      <div className="relative py-40 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_60%)]" />

        <StorySection className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Live Interactive Simulation</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
            This Is What<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Capital Can Build</span>
          </h2>

          <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto mb-12">
            Don&apos;t take our word for it. Step inside the live WASH-AI Nexus simulation. Generate data, trigger failures, watch the AI respond — all in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/dashboard/map"
              className="group relative inline-flex items-center space-x-3 px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-sm overflow-hidden transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] border border-blue-400"
            >
              <span className="relative z-10">Enter the Nexus</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
            </Link>

            <Link
              href="/dashboard/control"
              className="inline-flex items-center space-x-3 px-10 py-5 bg-transparent text-slate-300 hover:text-white font-bold uppercase tracking-widest text-sm border border-slate-700 hover:border-slate-500 bg-slate-900/50 backdrop-blur-md transition-all"
            >
              <span>Director Mode</span>
            </Link>
          </div>
        </StorySection>
      </div>


      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="border-t border-slate-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 uppercase tracking-widest">
          <span>Project Kwali &middot; WASH-AI Nexus &middot; v2.0</span>
          <span>Kwali Area Council &middot; Abuja, Nigeria</span>
        </div>
      </footer>
    </div>
  );
}
