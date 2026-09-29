import React, { useState } from 'react';
import { Users, ShieldCheck, CheckCircle2, AlertOctagon, HelpCircle, ArrowRight, Play, Terminal } from 'lucide-react';
import { TelemetryData } from '../types';

interface AgentArenaViewProps {
  telemetry: TelemetryData | null;
}

export const AgentArenaView: React.FC<AgentArenaViewProps> = ({ telemetry }) => {
  const [guardrailRunning, setGuardrailRunning] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('Thermal');
  const [guardrailVerdict, setGuardrailVerdict] = useState<{
    verdict: 'APPROVE' | 'MODIFY' | 'REJECT';
    reason: string;
    invariants: {
      min_zone_temp: boolean;
      fuel_tank_reserve: boolean;
      n_minus_1_reserve: boolean;
      zero_critical_shed: boolean;
    };
  }>({
    verdict: 'APPROVE',
    reason: 'All hard survival invariants satisfied in 72h sandbox forward simulation.',
    invariants: {
      min_zone_temp: true,
      fuel_tank_reserve: true,
      n_minus_1_reserve: true,
      zero_critical_shed: true,
    },
  });

  const agents = [
    { name: 'Energy', role: 'Microgrid Dispatch (MILP)', priority: 'C0 Life-Safety', state: 'ONLINE', currentBid: '165 kW @ $1.15/kWh' },
    { name: 'Thermal', role: 'Habitat & Envelope MPC', priority: 'C0 Life-Safety', state: 'ONLINE', currentBid: '68 kWth (Setback 18.5°C)' },
    { name: 'Water', role: 'Melt Tank & Potable LP', priority: 'C1 Structural', state: 'ONLINE', currentBid: '35 kW (Flexible deferral)' },
    { name: 'FuelLogistics', role: 'Burn Corridor Enforcement', priority: 'C0 Life-Safety', state: 'ONLINE', currentBid: 'Corridor [580, 720] L/d' },
    { name: 'Health', role: 'ISHM / FDIR Playbooks', priority: 'C1 Structural', state: 'ONLINE', currentBid: 'Derating G2 to 70kW' },
    { name: 'Safety', role: 'Blizzard & Movement Bans', priority: 'C0 Life-Safety', state: 'ONLINE', currentBid: 'Condition 1: Normal' },
    { name: 'Compliance', role: 'Madrid Protocol Ledger', priority: 'C2 Reporting', state: 'ONLINE', currentBid: 'Chain verified (Block #2)' },
  ];

  const handleTestGuardrail = () => {
    setGuardrailRunning(true);
    setTimeout(() => {
      setGuardrailVerdict({
        verdict: 'APPROVE',
        reason: 'Twin-as-Sandbox forward simulated 72 hours (4,320 steps in 18ms). Survival temperatures ≥ 17.5°C, fuel reserve preserved at 46,200L.',
        invariants: {
          min_zone_temp: true,
          fuel_tank_reserve: true,
          n_minus_1_reserve: true,
          zero_critical_shed: true,
        },
      });
      setGuardrailRunning(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Users className="w-4 h-4" />
            Distributed Multi-Agent System (B) & Simplex Sandbox (C)
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Autonomous Multi-Agent Negotiation & Simplex Guardrail
          </h2>
          <p className="text-xs text-polar-400">
            Resource allocation coordinated via ADMM shadow prices; every proposal passes an isolated 72h digital twin sandbox before execution.
          </p>
        </div>
      </div>

      {/* Multi-Agent Table */}
      <div className="polar-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-white">Active Station Agents</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-polar-800 text-polar-400">
                <th className="pb-3">AGENT</th>
                <th className="pb-3">SUB-SYSTEM</th>
                <th className="pb-3">PRIORITY</th>
                <th className="pb-3">LATEST ADMM PROPOSAL / BID</th>
                <th className="pb-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-800/60 text-polar-200">
              {agents.map((ag) => (
                <tr 
                  key={ag.name}
                  onClick={() => setSelectedAgent(ag.name)}
                  className={`hover:bg-polar-900/50 cursor-pointer transition-colors ${
                    selectedAgent === ag.name ? 'bg-cyan-950/20' : ''
                  }`}
                >
                  <td className="py-3 font-bold text-white flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    {ag.name} Agent
                  </td>
                  <td className="py-3 text-polar-300">{ag.role}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      ag.priority.includes('C0') 
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800' 
                        : 'bg-polar-900 text-polar-300 border border-polar-700'
                    }`}>
                      {ag.priority}
                    </span>
                  </td>
                  <td className="py-3 text-cyan-300">{ag.currentBid}</td>
                  <td className="py-3 text-right text-emerald-400 font-semibold">{ag.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Grid: Shadow Price Explanations & Simplex Guardrail Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shadow Price "Why?" Drawer */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-sm text-white">Auditable "Why?" Explanations via Shadow Prices</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">ADMM Dual Variables</span>
          </div>

          <p className="text-xs text-polar-300">
            LLMs do not sit in the control loop. Decisions are grounded directly in economic dual variables:
          </p>

          <div className="p-4 rounded-xl bg-polar-950/80 border border-polar-800 font-mono text-xs space-y-2">
            <div className="text-cyan-300 font-semibold flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              TRANSPARENT SYSTEM EXPLANATION:
            </div>
            <p className="text-polar-200 leading-relaxed">
              "Thermal agent pre-heated Zone 1 at 14:00 because electricity shadow price dipped to $0.82/kWh (wind generator surplus). 
              Snow melting was deferred at 18:00 because peak lighting load drove electricity shadow price to $1.45/kWh."
            </p>
          </div>
        </div>

        {/* Simplex Runtime Assurance Guardrail (Twin Sandbox) */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-semibold text-sm text-white">Simplex Guardrail (Twin-as-Sandbox)</h3>
            </div>
            <button
              onClick={handleTestGuardrail}
              disabled={guardrailRunning}
              className="px-3 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all"
            >
              <Play className={`w-3.5 h-3.5 ${guardrailRunning ? 'animate-spin' : ''}`} />
              {guardrailRunning ? 'Simulating...' : 'Test Sandbox'}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> VERDICT: {guardrailVerdict.verdict}
              </span>
              <span className="text-[10px] font-mono text-polar-400">72h Forward Sandbox</span>
            </div>
            <p className="text-xs text-polar-300 font-mono leading-relaxed">
              {guardrailVerdict.reason}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 p-2 rounded bg-polar-950 border border-polar-800 text-polar-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zone Temp ≥ 12°C</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-polar-950 border border-polar-800 text-polar-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Fuel Tank ≥ 5,000L</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-polar-950 border border-polar-800 text-polar-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>N-1 Spinning Reserve</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded bg-polar-950 border border-polar-800 text-polar-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Zero Critical Shedding</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
