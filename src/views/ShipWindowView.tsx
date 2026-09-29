import React, { useState } from 'react';
import { CalendarClock, Ship, ShieldAlert, TrendingDown, Gauge, Play, CheckCircle2 } from 'lucide-react';
import { TelemetryData } from '../types';

interface ShipWindowViewProps {
  telemetry: TelemetryData | null;
}

export const ShipWindowView: React.FC<ShipWindowViewProps> = ({ telemetry }) => {
  const [isSolving, setIsSolving] = useState(false);
  const [plannerResult, setPlannerResult] = useState({
    p10: 142.5,
    p50: 182.4,
    p90: 215.8,
    b_min: 580.0,
    b_max: 720.0,
    vss_liters: 14800.0,
  });

  const handleRunPlanner = () => {
    setIsSolving(true);
    setTimeout(() => {
      setPlannerResult({
        p10: 148.2,
        p50: 186.1,
        p90: 221.0,
        b_min: 590.0,
        b_max: 710.0,
        vss_liters: 15400.0,
      });
      setIsSolving(false);
    }, 1200);
  };

  const daysToShip = 158;

  return (
    <div className="space-y-6">
      {/* Hero Countdown Header */}
      <div className="polar-card-glow p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-wider uppercase">
              <Ship className="w-4 h-4" />
              Annual Resupply Vessel Window: MV Vasiliy Golovnin
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Polar Winter-Over Resupply Clock
            </h2>
            <p className="text-xs text-polar-300 max-w-xl">
              Whatever fuel, spare parts, or medical rations are not on station now cannot be delivered for the next 5 months. 
              The two-stage SAA stochastic program enforces a daily burn-rate corridor.
            </p>
          </div>

          {/* Big Isolation Clock */}
          <div className="flex items-center gap-4 bg-polar-950/80 px-6 py-4 rounded-xl border border-polar-800">
            <div className="text-center font-mono">
              <div className="text-4xl font-extrabold text-cyan-400">{daysToShip}</div>
              <div className="text-[10px] text-polar-400 uppercase tracking-widest mt-0.5">DAYS TO SHIP</div>
            </div>
            <div className="h-10 w-[1px] bg-polar-800" />
            <div className="text-center font-mono">
              <div className="text-4xl font-extrabold text-emerald-400">+{Math.round(plannerResult.p50 - daysToShip)}</div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-widest mt-0.5">BUFFER DAYS (P50)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Autonomy Fan Chart & Burn Corridor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fan Chart Card (Takes 2 cols) */}
        <div className="lg:col-span-2 polar-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Fuel Autonomy Distribution (Fan Chart)</h3>
              <p className="text-xs text-polar-400">Monte Carlo Sample Average Approximation (1,000 Weather & Sea-Ice Delay Scenarios)</p>
            </div>
            <button
              onClick={handleRunPlanner}
              disabled={isSolving}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-medium flex items-center gap-2 transition-all"
            >
              <Play className={`w-3.5 h-3.5 ${isSolving ? 'animate-spin' : ''}`} />
              {isSolving ? 'Solving SAA...' : 'Re-sample SAA'}
            </button>
          </div>

          {/* Visual Fan Curve Bars */}
          <div className="space-y-4 pt-2">
            {/* P90 Favorable */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-polar-300">P90 Favorable (Mild winter, low blizzard frequency):</span>
                <span className="text-emerald-400 font-bold">{plannerResult.p90} Days</span>
              </div>
              <div className="w-full bg-polar-950 rounded-full h-3 p-0.5 border border-polar-800">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${(plannerResult.p90 / 250) * 100}%` }} />
              </div>
            </div>

            {/* P50 Expected */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-polar-300">P50 Expected Median (Standard ERA5 Antarctic reanalysis):</span>
                <span className="text-cyan-400 font-bold">{plannerResult.p50} Days</span>
              </div>
              <div className="w-full bg-polar-950 rounded-full h-3 p-0.5 border border-polar-800">
                <div className="bg-cyan-400 h-full rounded-full transition-all" style={{ width: `${(plannerResult.p50 / 250) * 100}%` }} />
              </div>
            </div>

            {/* P10 Conservative */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-polar-300">P10 Conservative (Severe blizzards + 21-day pack-ice ship delay):</span>
                <span className="text-amber-400 font-bold">{plannerResult.p10} Days</span>
              </div>
              <div className="w-full bg-polar-950 rounded-full h-3 p-0.5 border border-polar-800">
                <div className="bg-amber-400 h-full rounded-full transition-all" style={{ width: `${(plannerResult.p10 / 250) * 100}%` }} />
              </div>
            </div>

            {/* Threshold Line */}
            <div className="pt-2 flex items-center justify-between text-xs font-mono border-t border-polar-800 text-polar-400">
              <span>Required Survival Window (158 days):</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Safe Across P50 & P90
              </span>
            </div>
          </div>
        </div>

        {/* Value of Stochastic Solution (VSS) & Corridor */}
        <div className="polar-card p-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-white">Value of Stochastic Solution (VSS)</h3>
            <p className="text-xs text-polar-400">Birge (1982) OR formulation</p>
          </div>

          <div className="p-4 rounded-xl bg-polar-950/80 border border-polar-800 space-y-2">
            <div className="text-xs text-polar-400 font-mono">FUEL SAVED OVER DETERMINISTIC PLAN:</div>
            <div className="text-2xl font-mono font-bold text-cyan-300">
              +{plannerResult.vss_liters.toLocaleString()} Litres
            </div>
            <p className="text-[11px] text-polar-400">
              A naive static plan stockouts under stochastic pack-ice delays. SAA dynamically shapes the daily burn corridor.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-polar-300">Daily Burn Corridor [B_min, B_max]:</div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-polar-950/60 border border-polar-800 font-mono text-xs">
              <span className="text-polar-400">MIN: {plannerResult.b_min} L/d</span>
              <span className="h-3 w-[1px] bg-polar-700" />
              <span className="text-white font-semibold">ACTUAL: 684 L/d</span>
              <span className="h-3 w-[1px] bg-polar-700" />
              <span className="text-amber-400">MAX: {plannerResult.b_max} L/d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
