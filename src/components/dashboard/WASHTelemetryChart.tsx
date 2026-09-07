"use client";

import * as React from "react";
import { useState } from "react";

interface TelemetryDataPoint {
  period: string;
  flowLpm: number;
  qualityScore: number;
  uptimePct: number;
}

const DEFAULT_TRENDS: TelemetryDataPoint[] = [
  { period: "Jan", flowLpm: 14.2, qualityScore: 84, uptimePct: 88 },
  { period: "Feb", flowLpm: 18.5, qualityScore: 89, uptimePct: 92 },
  { period: "Mar", flowLpm: 24.8, qualityScore: 78, uptimePct: 85 },
  { period: "Apr", flowLpm: 21.0, qualityScore: 82, uptimePct: 87 },
  { period: "May", flowLpm: 28.4, qualityScore: 91, uptimePct: 94 },
  { period: "Jun", flowLpm: 45.83, qualityScore: 95, uptimePct: 98 },
  { period: "Jul", flowLpm: 42.1, qualityScore: 93, uptimePct: 96 },
  { period: "Aug", flowLpm: 48.6, qualityScore: 90, uptimePct: 95 },
  { period: "Sep", flowLpm: 52.3, qualityScore: 94, uptimePct: 97 },
  { period: "Oct", flowLpm: 49.0, qualityScore: 92, uptimePct: 96 },
];

export function WASHTelemetryChart({
  isDark,
  wardName = "Kwali",
  currentFlow = 19.5,
  currentQuality = 92,
}: {
  isDark: boolean;
  wardName?: string;
  currentFlow?: number;
  currentQuality?: number;
}) {
  const [hoverIndex, setHoverIndex] = useState<number>(5); // Default to June (45.83) matching reference screenshot
  const [activeMetric, setActiveMetric] = useState<"flow" | "quality" | "both">("both");

  // Normalized data coordinates for SVG viewBox (width 600, height 180)
  const width = 600;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;
  const usableW = width - paddingX * 2;
  const usableH = height - paddingY * 2;

  const points = DEFAULT_TRENDS.map((d, i) => {
    const x = paddingX + (i / (DEFAULT_TRENDS.length - 1)) * usableW;
    const yFlow = height - paddingY - (d.flowLpm / 60) * usableH;
    const yQuality = height - paddingY - ((d.qualityScore - 50) / 50) * usableH;
    return { x, yFlow, yQuality, ...d };
  });

  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const flowPath = createSmoothPath(points.map((p) => ({ x: p.x, y: p.yFlow })));
  const qualityPath = createSmoothPath(points.map((p) => ({ x: p.x, y: p.yQuality })));

  const activePoint = points[hoverIndex] || points[5];

  return (
    <div
      className={`rounded-[26px] p-6 sm:p-7 border transition-all duration-300 ${
        isDark
          ? "bg-[#071528]/90 border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
          : "bg-white border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
      }`}
    >
      {/* Header with Title and Legend (matching reference design) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h3 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Borehole Telemetry & Quality Trends
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>
            Continuous IoT yield (LPM) and pgvector water quality index in {wardName}
          </p>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => setActiveMetric(activeMetric === "flow" ? "both" : "flow")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#486ff0]" />
            <span
              className={`font-medium transition-colors ${
                activeMetric === "flow" || activeMetric === "both"
                  ? isDark ? "text-white" : "text-slate-800"
                  : isDark ? "text-white/30" : "text-slate-400"
              }`}
            >
              Flow Rate (LPM)
            </span>
          </button>

          <button
            onClick={() => setActiveMetric(activeMetric === "quality" ? "both" : "quality")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#f44771]" />
            <span
              className={`font-medium transition-colors ${
                activeMetric === "quality" || activeMetric === "both"
                  ? isDark ? "text-white" : "text-slate-800"
                  : isDark ? "text-white/30" : "text-slate-400"
              }`}
            >
              Quality Score (/100)
            </span>
          </button>
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height + 25}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#486ff0" stopOpacity={isDark ? "0.25" : "0.15"} />
              <stop offset="100%" stopColor="#486ff0" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f44771" stopOpacity={isDark ? "0.20" : "0.10"} />
              <stop offset="100%" stopColor="#f44771" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[40, 80, 120, 160].map((y, idx) => (
            <line
              key={idx}
              x1={paddingX}
              y1={y}
              x2={width - paddingX}
              y2={y}
              stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}
              strokeDasharray="4,4"
            />
          ))}

          {/* Flow Area Fill */}
          {(activeMetric === "flow" || activeMetric === "both") && (
            <path
              d={`${flowPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`}
              fill="url(#flowGradient)"
            />
          )}

          {/* Quality Area Fill */}
          {(activeMetric === "quality" || activeMetric === "both") && (
            <path
              d={`${qualityPath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`}
              fill="url(#qualityGradient)"
            />
          )}

          {/* Quality Curve Stroke */}
          {(activeMetric === "quality" || activeMetric === "both") && (
            <path
              d={qualityPath}
              fill="none"
              stroke="#f44771"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Flow Curve Stroke */}
          {(activeMetric === "flow" || activeMetric === "both") && (
            <path
              d={flowPath}
              fill="none"
              stroke="#486ff0"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Vertical Indicator Line at Active Position */}
          <line
            x1={activePoint.x}
            y1={paddingY}
            x2={activePoint.x}
            y2={height - paddingY}
            stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
            strokeWidth="1.5"
          />

          {/* Active Node Points */}
          {(activeMetric === "flow" || activeMetric === "both") && (
            <circle
              cx={activePoint.x}
              cy={activePoint.yFlow}
              r="5"
              fill="#486ff0"
              stroke={isDark ? "#071528" : "#ffffff"}
              strokeWidth="2"
            />
          )}

          {(activeMetric === "quality" || activeMetric === "both") && (
            <circle
              cx={activePoint.x}
              cy={activePoint.yQuality}
              r="4.5"
              fill="#f44771"
              stroke={isDark ? "#071528" : "#ffffff"}
              strokeWidth="2"
            />
          )}

          {/* Interactive Trigger Overlays */}
          {points.map((p, i) => (
            <rect
              key={i}
              x={p.x - 20}
              y={paddingY}
              width="40"
              height={height - paddingY}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onClick={() => setHoverIndex(i)}
            />
          ))}

          {/* X-Axis Month Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height + 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight={hoverIndex === i ? "bold" : "normal"}
              fill={
                hoverIndex === i
                  ? isDark ? "#ffffff" : "#0f172a"
                  : isDark ? "rgba(255,255,255,0.4)" : "rgba(100,116,139,0.7)"
              }
              className="font-mono transition-colors"
            >
              {p.period}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip Pill */}
        <div
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max(10, (activePoint.yFlow / height) * 100 - 24)}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150 z-20"
        >
          <div className="bg-[#486ff0] text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold shadow-lg shadow-blue-500/25 whitespace-nowrap flex items-center gap-1.5">
            <span>{activePoint.flowLpm.toFixed(1)} LPM</span>
            <span className="opacity-60 text-[10px]">·</span>
            <span className="text-pink-200 text-[11px]">{activePoint.qualityScore}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
}
