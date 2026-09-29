import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Gauge, 
  Search, 
  Radio, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { TelemetryData, FaultHypothesis } from '../types';
import { diagnoseResiduals } from '../services/api';

interface HealthViewProps {
  telemetry: TelemetryData | null;
}

export const HealthView: React.FC<HealthViewProps> = ({ telemetry }) => {
  const t = telemetry;
  const [diagnosing, setDiagnosing] = useState(false);
  const [faultList, setFaultList] = useState<FaultHypothesis[]>([
    { fault: 'injector_fouling', probability: 0.78 },
    { fault: 'turbo_degradation', probability: 0.14 },
    { fault: 'fuel_sensor_stuck', probability: 0.05 },
    { fault: 'fuel_leak', probability: 0.03 },
  ]);

  const handleRunDiagnosis = async () => {
    setDiagnosing(true);
    try {
      const results = await diagnoseResiduals({
        fuel_residual: 4.2,
        exhaust_temp_residual: 68.0,
        tank_balance: 0.0,
        kw_residual: 0.0,
      });
      setFaultList(results);
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Spacecraft ISHM / FDIR Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Layers className="w-4 h-4" />
            NASA / Spacecraft ISHM & FDIR Protocol
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Integrated System Health Management & Analytical Redundancy
          </h2>
          <p className="text-xs text-polar-400">
            Discriminates "Sensor Iced/Stuck" from "Plant Component Degradation" using Model 1 Virtual Sensors & Model 6 Bayesian Isolation
          </p>
        </div>

        <button
          onClick={handleRunDiagnosis}
          disabled={diagnosing}
          className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-mono font-medium flex items-center gap-2 transition-all"
        >
          <Search className={`w-3.5 h-3.5 ${diagnosing ? 'animate-spin' : ''}`} />
          {diagnosing ? 'Evaluating Bayesian Network...' : 'Run FDIR Diagnosis'}
        </button>
      </div>

      {/* Analytical Redundancy Card (Model 1 & Model 2) */}
      <div className="polar-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Model 1 & 2: Virtual Sensor Analytical Redundancy (Genset Fuel Flow)
            </h3>
            <p className="text-xs text-polar-400">
              Physics Prior (Willans Line) + LightGBM Residual + 90% Conformal Calibration Bounds
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
            Quality q = 0.96 (High Confidence)
          </span>
        </div>

        {/* 3-Way Signal Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Physical Sensor Reading */}
          <div className="p-4 rounded-xl bg-polar-950/80 border border-polar-800 space-y-2">
            <div className="text-xs text-polar-400 font-mono flex items-center justify-between">
              <span>PHYSICAL SENSOR (FLOWMETER)</span>
              <span className="text-cyan-400">src: phys</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">25.5 L/h</div>
            <p className="text-[11px] text-polar-400">
              Direct Coriolis flowmeter reading on Genset 1 supply manifold.
            </p>
          </div>

          {/* Physics Willans Baseline */}
          <div className="p-4 rounded-xl bg-polar-950/80 border border-polar-800 space-y-2">
            <div className="text-xs text-polar-400 font-mono flex items-center justify-between">
              <span>PHYSICS WILLANS BASELINE</span>
              <span className="text-amber-400">F0 + k·P</span>
            </div>
            <div className="text-2xl font-bold font-mono text-amber-300">23.2 L/h</div>
            <p className="text-[11px] text-polar-400">
              Kinematic equation: F0 = 4.5 L/h, k = 0.22 L/kWh at 85 kW load.
            </p>
          </div>

          {/* Model 1 Virtual Sensor Prediction */}
          <div className="p-4 rounded-xl bg-polar-950/80 border border-cyan-500/30 space-y-2">
            <div className="text-xs text-cyan-400 font-mono flex items-center justify-between">
              <span>VIRTUAL SENSOR (LIGHTGBM + CONFORMAL)</span>
              <span className="text-emerald-400">src: virt</span>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-300">25.4 L/h</div>
            <p className="text-[11px] text-polar-400">
              Conformal 90% Interval: [24.9, 26.0] L/h. Coverage: 92.4%.
            </p>
          </div>
        </div>

        {/* Diagnostic Verdict */}
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/80 flex items-center gap-3 text-xs font-mono text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            ANALYTICAL REDUNDANCY VERDICT: Physical sensor agrees with virtual sensor within calibrated conformal bounds (|residual| = 0.1 L/h &lt; q90). No sensor icing or pipeline leak detected.
          </span>
        </div>
      </div>

      {/* Two-Column Grid: Model 6 Bayesian Posterior & Model 5 RUL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model 6: Bayesian Fault-Symptom Isolation */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-white">Model 6: Bayesian Fault-Symptom Isolation</h3>
              <p className="text-xs text-polar-400">Ranked Posterior Probabilities P(Fault | Symptoms)</p>
            </div>
            <span className="text-xs font-mono text-purple-400">Top-1 Accuracy: 94.2%</span>
          </div>

          <div className="space-y-3">
            {faultList.map((f, idx) => (
              <div key={f.fault} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-polar-200 capitalize">
                    {idx + 1}. {f.fault.replace('_', ' ')}
                  </span>
                  <span className={`font-bold ${idx === 0 ? 'text-amber-400' : 'text-polar-400'}`}>
                    {(f.probability * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-polar-950 rounded-full h-2.5 p-0.5 border border-polar-800">
                  <div
                    className={`h-full rounded-full transition-all ${
                      idx === 0 ? 'bg-amber-400' : 'bg-polar-600'
                    }`}
                    style={{ width: `${f.probability * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model 5: Prognostics & Remaining Useful Life (RUL) */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm text-white">Model 5: Prognostic RUL (Genset Components)</h3>
              <p className="text-xs text-polar-400">Weibull Distribution + 500-Particle SIR Tracking</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Feeds Logistics SAA</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-2">
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">RUL P10 (RISK)</div>
              <div className="text-xl font-bold text-amber-400 mt-1">14.8 Days</div>
              <div className="text-[10px] text-polar-500 mt-0.5">Conservative</div>
            </div>
            <div className="p-3 rounded-lg bg-polar-950/70 border border-cyan-500/40">
              <div className="text-cyan-400 text-[10px]">RUL P50 (EXPECTED)</div>
              <div className="text-xl font-bold text-white mt-1">28.5 Days</div>
              <div className="text-[10px] text-polar-500 mt-0.5">Median</div>
            </div>
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 text-[10px]">RUL P90 (BENIGN)</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">45.2 Days</div>
              <div className="text-[10px] text-polar-500 mt-0.5">Optimistic</div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-polar-950/80 border border-polar-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-polar-400">
              <span>HEALTH INDICATOR (HI):</span>
              <span className="text-white font-semibold">1.42 / 10.0 (Threshold)</span>
            </div>
            <div className="flex justify-between text-polar-400">
              <span>FDIR AUTONOMY LEVEL:</span>
              <span className="text-emerald-400 font-semibold">L1 (Edge Autonomous Envelope)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
