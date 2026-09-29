import React, { useState } from 'react';
import { Radio, Wifi, WifiOff, RefreshCw, Database, Layers, ArrowDownUp, ShieldCheck } from 'lucide-react';
import { TelemetryData } from '../types';

interface SatlinkViewProps {
  telemetry: TelemetryData | null;
  linkOnline: boolean;
  setLinkOnline: (online: boolean) => void;
}

export const SatlinkView: React.FC<SatlinkViewProps> = ({ telemetry, linkOnline, setLinkOnline }) => {
  const [outageHours, setOutageHours] = useState<number>(linkOnline ? 0 : 36);

  const toggleOutage = () => {
    if (linkOnline) {
      setLinkOnline(false);
      setOutageHours(36);
    } else {
      setLinkOnline(true);
      setOutageHours(0);
    }
  };

  const channels = [
    { name: 'Station Load (kW)', base: 165.0, eps: 5.0, unit: 'kW' },
    { name: 'Living Quarter Temp (°C)', base: 20.4, eps: 0.5, unit: '°C' },
    { name: 'Genset 1 Power (kW)', base: 85.0, eps: 4.0, unit: 'kW' },
    { name: 'Fuel Tank Level (L)', base: 51240.0, eps: 50.0, unit: 'L' },
    { name: 'Battery SOC (%)', base: 78.0, eps: 2.0, unit: '%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Radio className="w-4 h-4" />
            Layer 8: Twin-as-Codec & Dual-Prediction Sync
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Predictive Codec & Delay-Tolerant Satellite Synchronization
          </h2>
          <p className="text-xs text-polar-400">
            Station Edge & Goa HQ run identical baseline models; Edge transmits innovations only when |y - ŷ| &gt; ε, reducing satellite bandwidth by &gt; 300x.
          </p>
        </div>

        <button
          onClick={toggleOutage}
          className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            linkOnline
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          {linkOnline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
          {linkOnline ? 'Simulate 72h Satellite Outage' : 'Restore Satellite Uplink'}
        </button>
      </div>

      {/* Bandwidth Savings Meter Card */}
      <div className="polar-card-glow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-polar-950/80 border border-polar-800">
            <div className="text-polar-400 text-xs font-mono">RAW 1Hz SCADA (TELEMETRY)</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">2,840 MB/d</div>
            <div className="text-[10px] text-rose-400 mt-1">Saturates 64kbps link (Fails)</div>
          </div>

          <div className="p-4 rounded-xl bg-polar-950/80 border border-polar-800">
            <div className="text-polar-400 text-xs font-mono">SEND-ON-DELTA (DEADBAND)</div>
            <div className="text-2xl font-bold text-amber-300 font-mono mt-1">115 MB/d</div>
            <div className="text-[10px] text-amber-400 mt-1">~24x compression</div>
          </div>

          <div className="p-4 rounded-xl bg-polar-950/80 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <div className="text-cyan-300 text-xs font-mono font-semibold">TWIN-AS-CODEC INNOVATIONS</div>
            <div className="text-3xl font-extrabold text-cyan-300 font-mono mt-1">8.4 MB/d</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Fits comfortably in 4h window</div>
          </div>

          <div className="p-4 rounded-xl bg-polar-950/80 border border-emerald-500/40">
            <div className="text-emerald-400 text-xs font-mono font-semibold">NET BANDWIDTH REDUCTION</div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">338x</div>
            <div className="text-[10px] text-polar-300 mt-1">99.7% Telemetry Suppressed</div>
          </div>
        </div>
      </div>

      {/* Uncertainty Cone Demonstration */}
      <div className="polar-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Goa HQ Coasting Replica & Uncertainty Cone Dynamics
            </h3>
            <p className="text-xs text-polar-400">
              Uncertainty grows as σ·sqrt(t) during outages; collapses instantly upon reconnection.
            </p>
          </div>
          <div className="text-xs font-mono">
            Status: <span className={linkOnline ? 'text-emerald-400' : 'text-rose-400'}>
              {linkOnline ? 'LINK SYNCHRONIZED (Cone Collapsed)' : `BLACKOUT DURATION: ${outageHours}h (Cone Expanding)`}
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {channels.map((ch) => {
            const uncertainty = linkOnline ? 0.2 : (ch.eps * Math.sqrt(outageHours / 12.0) + 0.5);
            const lo = (ch.base - uncertainty).toFixed(1);
            const hi = (ch.base + uncertainty).toFixed(1);

            return (
              <div key={ch.name} className="p-3.5 rounded-xl bg-polar-950/80 border border-polar-800 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-polar-200 font-semibold">{ch.name}</span>
                  <span className="text-cyan-300">
                    Expected: {ch.base} {ch.unit} | 90% Bounds: [{lo}, {hi}] {ch.unit}
                  </span>
                </div>

                {/* Visual Cone Bar */}
                <div className="w-full bg-polar-900 rounded-full h-3 relative overflow-hidden flex items-center">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      linkOnline ? 'bg-emerald-400 w-1/2' : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, Math.max(15, (uncertainty / (ch.eps * 3)) * 80))}%`,
                      margin: '0 auto' 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
