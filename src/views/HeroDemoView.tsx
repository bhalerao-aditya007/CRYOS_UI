import React, { useState } from 'react';
import { 
  Flame, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Wind, 
  Thermometer, 
  Ship, 
  WifiOff, 
  ShieldCheck, 
  Radio, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { HeroDemoResponse, ScenarioStep } from '../types';
import { runHeroDemo } from '../services/api';

interface HeroDemoViewProps {
  station: string;
}

export const HeroDemoView: React.FC<HeroDemoViewProps> = ({ station }) => {
  const [running, setRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [demoData, setDemoData] = useState<HeroDemoResponse | null>(null);

  const handleLaunchDemo = async () => {
    setRunning(true);
    setActiveStepIndex(0);
    const data = await runHeroDemo(station);
    setDemoData(data);

    // Animate through timeline steps
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < data.timeline.length) {
        setActiveStepIndex(current);
      } else {
        clearInterval(interval);
        setRunning(false);
      }
    }, 1800);
  };

  const handleReset = () => {
    setDemoData(null);
    setActiveStepIndex(0);
    setRunning(false);
  };

  const activeStep: ScenarioStep | null = demoData ? demoData.timeline[activeStepIndex] : null;

  return (
    <div className="space-y-6">
      {/* Hero Demo Control Banner */}
      <div className="polar-card-glow p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs tracking-wider uppercase font-semibold">
              <Flame className="w-4 h-4 animate-pulse" />
              SIH Hero Demo: Antarctic Multi-Crisis Simulation
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Blizzard + Genset Degradation + Ship Delayed 3 Weeks + 72h Link Blackout
            </h2>
            <p className="text-xs text-polar-300 max-w-2xl leading-relaxed">
              Showcases the full digital twin value proposition: Analytical Redundancy separates sensor icing from engine fouling, 
              Two-Stage SAA tightens burn corridor against pack-ice delays, ADMM agents shift flexible loads via shadow prices, 
              and the Twin-as-Codec coasts during blackouts before collapsing the uncertainty cone upon reconnection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!demoData ? (
              <button
                onClick={handleLaunchDemo}
                disabled={running}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-black font-bold font-mono text-sm hover:from-amber-400 hover:to-rose-500 shadow-lg shadow-amber-500/20 flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                EXECUTE HERO CRISIS DEMO
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-lg bg-polar-900 border border-polar-700 text-polar-200 hover:text-white font-mono text-xs flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Demo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Headline Badges (When demo has run) */}
      {demoData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in font-mono text-xs">
          <div className="p-4 rounded-xl polar-card border-emerald-500/40 text-center">
            <div className="text-polar-400 text-[10px]">AUTONOMY DAYS GAINED</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              +{demoData.kpis.fuel_autonomy_days_gained} Days
            </div>
            <div className="text-[10px] text-polar-400 mt-1">Prevented Winter Stockout</div>
          </div>

          <div className="p-4 rounded-xl polar-card border-amber-500/40 text-center">
            <div className="text-polar-400 text-[10px]">PEAK SHADOW PRICE (λ)</div>
            <div className="text-2xl font-bold text-amber-300 mt-1">
              ${demoData.kpis.peak_shadow_price_kwh}/kWh
            </div>
            <div className="text-[10px] text-polar-400 mt-1">Automated Demand Response</div>
          </div>

          <div className="p-4 rounded-xl polar-card border-cyan-500/40 text-center">
            <div className="text-polar-400 text-[10px]">SURVIVAL INVARIANTS</div>
            <div className="text-2xl font-bold text-cyan-300 mt-1">0 Violated</div>
            <div className="text-[10px] text-emerald-400 mt-1">Certified Safe by Sandbox</div>
          </div>

          <div className="p-4 rounded-xl polar-card border-purple-500/40 text-center">
            <div className="text-polar-400 text-[10px]">SYNC COMPRESSION</div>
            <div className="text-2xl font-bold text-purple-300 mt-1">
              {demoData.kpis.sync_compression_ratio}
            </div>
            <div className="text-[10px] text-polar-400 mt-1">Twin-as-Codec Innovation</div>
          </div>
        </div>
      )}

      {/* Step Progress Indicators */}
      {demoData && (
        <div className="polar-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-polar-800 pb-4">
            <h3 className="text-base font-semibold text-white">Crisis Sequence Progression</h3>
            <span className="text-xs font-mono text-cyan-400">
              Step {activeStepIndex + 1} of {demoData.timeline.length}
            </span>
          </div>

          {/* Timeline Pills */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {demoData.timeline.map((step, idx) => (
              <button
                key={step.step_id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                  idx === activeStepIndex
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                    : idx < activeStepIndex
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-polar-950/60 border-polar-800 text-polar-400'
                }`}
              >
                <div className="text-[10px] opacity-75">PHASE 0{step.step_id}</div>
                <div className="truncate font-semibold mt-0.5">{step.phase}</div>
              </button>
            ))}
          </div>

          {/* Active Step Deep-Dive Card */}
          {activeStep && (
            <div className="p-5 rounded-xl bg-polar-950/80 border border-amber-500/30 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono text-xs font-bold">
                    STEP {activeStep.step_id}
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-wide">
                    {activeStep.title}
                  </h4>
                </div>
              </div>

              <p className="text-sm text-polar-200 leading-relaxed font-sans">
                {activeStep.details}
              </p>

              {/* Agent Actions Triggered */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-polar-400 uppercase tracking-wider">
                  Agent Actions Triggered:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                  {activeStep.agent_actions.map((act, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-polar-900 border border-polar-800 space-y-1">
                      <div className="text-cyan-400 font-semibold">{act.agent} Agent</div>
                      <div className="text-polar-200">{act.action}</div>
                      <div className="text-[10px] text-emerald-400 uppercase font-bold">{act.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Simulated Telemetry */}
              <div className="p-3 rounded-lg bg-polar-900/60 border border-polar-800 text-xs font-mono grid grid-cols-2 md:grid-cols-4 gap-3 text-polar-300">
                {Object.entries(activeStep.telemetry_sample).map(([k, val]) => (
                  <div key={k}>
                    <span className="text-polar-500">{k}: </span>
                    <span className="text-white font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
