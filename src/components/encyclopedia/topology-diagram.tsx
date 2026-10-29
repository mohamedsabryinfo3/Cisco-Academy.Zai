"use client";

import type { Topology } from "@/lib/encyclopedia-data";
import { Router, Server, Cloud, Monitor, Shield } from "lucide-react";

// ===================================================================
// TopologyDiagram — يرسم طوبولوجيا الشبكة باستخدام SVG
// ===================================================================

interface Props {
  topology: Topology;
}

const ICON_MAP = {
  router: Router,
  switch: Server,
  pc: Monitor,
  server: Server,
  cloud: Cloud,
  firewall: Shield,
};

const ICON_COLORS: Record<string, string> = {
  router: "#0d6efd",
  switch: "#0d6efd",
  pc: "#64748b",
  server: "#0d6efd",
  cloud: "#64748b",
  firewall: "#dc2626",
};

export function TopologyDiagram({ topology }: Props) {
  const { nodes, links } = topology;

  return (
    <div className="my-4 rounded-lg border bg-card p-4">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        طوبولوجيا الشبكة — Network Topology
      </div>
      <div className="relative w-full" style={{ minHeight: "220px" }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ minHeight: "220px" }}
        >
          {links.map((link, i) => {
            const from = nodes.find((n) => n.id === link.from);
            const to = nodes.find((n) => n.id === link.to);
            if (!from || !to) return null;
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            return (
              <g key={`link-${i}`}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#0d6efd"
                  strokeWidth="0.5"
                  strokeDasharray={link.type === "wan" ? "1,0.5" : undefined}
                />
                {link.label && (
                  <text x={midX} y={midY - 1} textAnchor="middle" fontSize="2.2" fill="#64748b" className="font-mono">
                    {link.label.split("\n").map((line, j) => (
                      <tspan key={j} x={midX} dy={j === 0 ? 0 : 2.5}>{line}</tspan>
                    ))}
                  </text>
                )}
              </g>
            );
          })}
          {nodes.map((node) => {
            const color = ICON_COLORS[node.type] || "#64748b";
            const labelLines = node.label.split("\n");
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r="5" fill="white" stroke={color} strokeWidth="0.4" />
                <text x={node.x} y={node.y + 1.5} textAnchor="middle" fontSize="4" fill={color} fontWeight="bold">
                  {node.type === "router" ? "R" : node.type === "switch" ? "S" : node.type === "pc" ? "PC" : node.type === "cloud" ? "☁" : node.type === "firewall" ? "FW" : "S"}
                </text>
                <text x={node.x} y={node.y + 8} textAnchor="middle" fontSize="2.2" fill="#1e293b" fontWeight="600">
                  {labelLines.map((line, j) => (
                    <tspan key={j} x={node.x} dy={j === 0 ? 0 : 2.5}>{line}</tspan>
                  ))}
                </text>
                {node.ip && (
                  <text x={node.x} y={node.y + 8 + labelLines.length * 2.5} textAnchor="middle" fontSize="1.8" fill="#64748b" className="font-mono">
                    {node.ip}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
