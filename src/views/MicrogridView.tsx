import React from 'react';
import { Zap, Flame, Battery, Gauge, AlertTriangle, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { TelemetryData } from '../types';

interface MicrogridViewProps {
  telemetry: TelemetryData | null;
}

export const MicrogridView: React.FC<MicrogridViewProps> = ({ telemetry }) => {
  const t = telemetry;
  const g1_kw = t?.microgrid.genset1_kw || 85.0;
  const g2_kw = t?.microgrid.genset2_kw || 80.0;
  const g3_kw = t?.microgrid.genset3_kw || 0.0;
  const load_kw = t?.microgrid.load_kw || 165.0;

  return (
    <div className="space-y-6">
      {/* Title & Real-Time Merit-Order Dispatch Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Microgrid Generation & Waste-Heat Thermal Loop
          </h2>
          <p className="text-xs text-polar-400">
            Rolling-Horizon Unit Commitment MILP with Wet-Stacking Prevention (Min Load ≥ 35%)
          </p>
        </div>

        {/* Dynamic Shadow Prices Ticker */}
        <div className="flex items-center gap-3 bg-polar-950/80 p-2 rounded-xl border border-polar-800 text-xs font-mono">
          <div className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
            <span>λ_elec: </span>
            <span className="font-bold">$1.15/kWh</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800/80">
            <span>λ_th: </span>
            <span className="font-bold">$0.46/kWth</span>
          </div>
          <div className="px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800/80">
            <span>λ_fuel: </span>
            <span className="font-bold">$2.88/L</span>
          </div>
        </div>
      </div>

      {/* 3 Genset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Genset 1 */}
        <div className="polar-card p-5 space-y-4 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-sm text-white">GENSET 1 (Kirloskar 125kW)</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              LEAD (ONLINE)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-polar-400">Current Output:</span>
              <span className="text-white font-bold">{g1_kw} kW ({Math.round((g1_kw / 125) * 100)}% Load)</span>
            </div>
            <div className="w-full bg-polar-950 rounded-full h-2.5 p-0.5 border border-polar-800">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all" 
                style={{ width: `${(g1_kw / 125) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-polar-500 font-mono">
              <span>Min Wet-Stacking: 43.8 kW</span>
              <span>Rated: 125 kW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-polar-800">
            <div className="p-2 rounded bg-polar-950/70">
              <div className="text-polar-400 text-[10px]">EXHAUST TEMP</div>
              <div className="text-white font-semibold mt-0.5">412°C (Norm)</div>
            </div>
            <div className="p-2 rounded bg-polar-950/70">
              <div className="text-polar-400 text-[10px]">FUEL CONSUMPTION</div>
              <div className="text-white font-semibold mt-0.5">25.5 L/h</div>
            </div>
          </div>
        </div>

        {/* Genset 2 */}
        <div className="polar-card p-5 space-y-4 border-amber-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-bold text-sm text-white">GENSET 2 (Kirloskar 125kW)</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              LAG (ONLINE)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-polar-400">Current Output:</span>
              <span className="text-white font-bold">{g2_kw} kW ({Math.round((g2_kw / 125) * 100)}% Load)</span>
            </div>
            <div className="w-full bg-polar-950 rounded-full h-2.5 p-0.5 border border-polar-800">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all" 
                style={{ width: `${(g2_kw / 125) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-polar-500 font-mono">
              <span>Min Wet-Stacking: 43.8 kW</span>
              <span>Rated: 125 kW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-polar-800">
            <div className="p-2 rounded bg-polar-950/70">
              <div className="text-polar-400 text-[10px]">EXHAUST TEMP</div>
              <div className="text-white font-semibold mt-0.5">408°C (Norm)</div>
            </div>
            <div className="p-2 rounded bg-polar-950/70">
              <div className="text-polar-400 text-[10px]">FUEL CONSUMPTION</div>
              <div className="text-white font-semibold mt-0.5">24.2 L/h</div>
            </div>
          </div>
        </div>

        {/* Genset 3 */}
        <div className="polar-card p-5 space-y-4 border-polar-800 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-polar-600" />
              <h3 className="font-bold text-sm text-polar-300">GENSET 3 (Kirloskar 125kW)</h3>
            </div>
            <span className="text-[11px] font-mono text-polar-400 bg-polar-900 px-2 py-0.5 rounded border border-polar-800">
              N-1 STANDBY
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-polar-400">Current Output:</span>
              <span className="text-polar-300 font-bold">0.0 kW (Cold Standby)</span>
            </div>
            <div className="w-full bg-polar-950 rounded-full h-2.5 p-0.5 border border-polar-800">
              <div className="bg-polar-600 h-full rounded-full" style={{ width: '0%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-polar-500 font-mono">
              <span>Ready in: 45 seconds</span>
              <span>Rated: 125 kW</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-polar-800">
            <div className="p-2 rounded bg-polar-950/70">
              <div className="text-polar-400 text-[10px]">BLOCK HEATER</div>
              <div className="text-emerald-400 font-semibold mt-0.5">Warm (45°C)</div>
            </div>
            <div className="p-2 rounded bg-polar-950/70">
              <div className="text-polar-400 text-[10px]">BATTERY CRANK</div>
              <div className="text-emerald-400 font-semibold mt-0.5">26.8V Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column: Waste-Heat Hydronic Loop & BESS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Heat Recovery (Biggest efficiency lever) */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-sm text-white">Genset Waste-Heat Hydronic Loop</h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">Thermal Coproduct</span>
          </div>

          <p className="text-xs text-polar-300">
            Jacket cooling water & exhaust heat exchangers extract ~42% of mechanical output as usable thermal heat, 
            heating living quarters and melting fresh glacial lake ice.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">THERMAL RECOVERED</div>
              <div className="text-xl font-bold text-cyan-300 mt-1">{t?.thermal.waste_heat_kw || 68.2} kWth</div>
            </div>
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">HYDRONIC TEMP</div>
              <div className="text-xl font-bold text-teal-300 mt-1">78.5°C</div>
            </div>
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">DIESEL DISPLACED</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">16.4 L/h</div>
            </div>
          </div>
        </div>

        {/* Battery Energy Storage System (BESS) */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-teal-400" />
              <h3 className="font-semibold text-sm text-white">Thevenin 1-RC Battery Storage (200kWh)</h3>
            </div>
            <span className="text-xs font-mono text-teal-400">Peak Shaving</span>
          </div>

          <p className="text-xs text-polar-300">
            Arrhenius capacity model accounts for cold temperature derating. Charge inhibited below -10°C.
          </p>

          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">SOC STATUS</div>
              <div className="text-xl font-bold text-white mt-1">
                {Math.round((t?.microgrid.battery_soc || 0.78) * 100)}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">INTERNAL TEMP</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">+14.2°C</div>
            </div>
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">BUS VOLTAGE</div>
              <div className="text-xl font-bold text-teal-300 mt-1">51.2 V</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
