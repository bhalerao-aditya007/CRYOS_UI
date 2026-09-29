import React from 'react';
import { 
  Zap, 
  Flame, 
  Droplet, 
  Wind, 
  Sun, 
  BatteryCharging, 
  ShieldCheck, 
  AlertCircle,
  Thermometer,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { TelemetryData } from '../types';

interface OverviewViewProps {
  station: string;
  telemetry: TelemetryData | null;
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ station, telemetry, onNavigate }) => {
  const t = telemetry;
  const isMaitri = station.toLowerCase() === 'maitri';

  return (
    <div className="space-y-6">
      {/* Top Banner / Headline KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Fuel Autonomy Days */}
        <div 
          onClick={() => onNavigate('ship-window')}
          className="polar-card p-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-polar-400 text-xs font-mono mb-1">
            <span>FUEL AUTONOMY (P50)</span>
            <ArrowUpRight className="w-4 h-4 group-hover:text-cyan-400 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
            <span>{t?.logistics.autonomy_days_p50 ? `${t.logistics.autonomy_days_p50} d` : '182.4 d'}</span>
            <span className="text-xs font-normal text-emerald-400">Target: ≥ 160 d</span>
          </div>
          <div className="mt-2 w-full bg-polar-950 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        {/* KPI 2: Microgrid Load & Gensets */}
        <div 
          onClick={() => onNavigate('microgrid')}
          className="polar-card p-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-polar-400 text-xs font-mono mb-1">
            <span>STATION POWER LOAD</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
            <span>{t?.microgrid.load_kw ? `${t.microgrid.load_kw} kW` : '165.2 kW'}</span>
            <span className="text-xs font-normal text-polar-300">G1: {t?.microgrid.genset1_kw || 85}kW | G2: {t?.microgrid.genset2_kw || 80}kW</span>
          </div>
          <p className="text-xs text-polar-400 mt-2 font-mono">N-1 Spinning Reserve: 125.0 kW (Valid)</p>
        </div>

        {/* KPI 3: Living Quarters Thermal */}
        <div 
          onClick={() => onNavigate('microgrid')}
          className="polar-card p-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-polar-400 text-xs font-mono mb-1">
            <span>LIVING QUARTERS INDOOR</span>
            <Thermometer className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono flex items-baseline gap-2">
            <span>{t?.thermal.living_zone_c ? `${t.thermal.living_zone_c}°C` : '20.4°C'}</span>
            <span className="text-xs font-normal text-emerald-400">Comfort: 18 - 22°C</span>
          </div>
          <p className="text-xs text-polar-400 mt-2 font-mono">Waste heat capture: {t?.thermal.waste_heat_kw || 68.2} kWth</p>
        </div>

        {/* KPI 4: ISHM / FDIR Health */}
        <div 
          onClick={() => onNavigate('health')}
          className="polar-card p-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-polar-400 text-xs font-mono mb-1">
            <span>ISHM / FDIR INTEGRITY</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono flex items-baseline gap-2">
            <span>{t?.fdir.status || 'HEALTHY'}</span>
            <span className="text-xs text-polar-300">{t?.fdir.active_incidents || 0} incidents</span>
          </div>
          <p className="text-xs text-polar-400 mt-2 font-mono">Anomaly Score: {t?.fdir.anomaly_score || 0.04}</p>
        </div>
      </div>

      {/* Main Single-Line Interactive Microgrid Diagram */}
      <div className="polar-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white tracking-wide">
              {isMaitri ? 'Maitri' : 'Bharati'} Microgrid & Habitat Single-Line Topology
            </h2>
            <p className="text-xs text-polar-400">
              415V 3-Phase Busbar with Waste-Heat Recovery Hydronic Circuit
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Genset 1 (ONLINE)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Genset 2 (ONLINE)
            </span>
            <span className="flex items-center gap-1.5 text-polar-400">
              <span className="h-2 w-2 rounded-full bg-polar-600" />
              Genset 3 (STANDBY)
            </span>
          </div>
        </div>

        {/* Visual Topological Bus Layout */}
        <div className="relative border border-polar-800/80 rounded-xl bg-polar-950/60 p-6 overflow-x-auto">
          {/* Main 415V Bus Line */}
          <div className="w-full h-3 bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 rounded-full my-12 relative shadow-lg shadow-cyan-500/20">
            <span className="absolute -top-6 left-4 text-[10px] font-mono tracking-widest text-cyan-300 uppercase">
              MAIN 415V SYNCHRONIZED AC BUSBAR
            </span>
          </div>

          {/* Sources (Above Bus) */}
          <div className="grid grid-cols-4 gap-4 -mt-24 mb-16">
            {/* Genset 1 */}
            <div className="polar-card p-3 border-amber-500/30 text-center">
              <div className="text-xs font-bold text-amber-400">GENSET 1 (125kW)</div>
              <div className="text-lg font-mono font-semibold text-white my-1">
                {t?.microgrid.genset1_kw || 85.0} kW
              </div>
              <div className="text-[11px] text-polar-400 font-mono">
                Exhaust: 412°C | 25.5 L/h
              </div>
            </div>

            {/* Genset 2 */}
            <div className="polar-card p-3 border-amber-500/30 text-center">
              <div className="text-xs font-bold text-amber-400">GENSET 2 (125kW)</div>
              <div className="text-lg font-mono font-semibold text-white my-1">
                {t?.microgrid.genset2_kw || 80.0} kW
              </div>
              <div className="text-[11px] text-polar-400 font-mono">
                Exhaust: 408°C | 24.2 L/h
              </div>
            </div>

            {/* BESS Battery Storage */}
            <div className="polar-card p-3 border-teal-500/30 text-center">
              <div className="text-xs font-bold text-teal-400 flex items-center justify-center gap-1">
                <BatteryCharging className="w-3.5 h-3.5" />
                BESS (200kWh)
              </div>
              <div className="text-lg font-mono font-semibold text-white my-1">
                {Math.round((t?.microgrid.battery_soc || 0.78) * 100)}% SOC
              </div>
              <div className="text-[11px] text-polar-400 font-mono">
                51.2V | {t?.microgrid.battery_kw || '+1.2'} kW
              </div>
            </div>

            {/* Renewables */}
            <div className="polar-card p-3 border-purple-500/30 text-center">
              <div className="text-xs font-bold text-purple-400 flex items-center justify-center gap-1">
                <Wind className="w-3.5 h-3.5" />
                WIND & PV
              </div>
              <div className="text-lg font-mono font-semibold text-white my-1">
                4.8 kW
              </div>
              <div className="text-[11px] text-polar-400 font-mono">
                Wind: 4.8 kW | PV: Polar Night (0W)
              </div>
            </div>
          </div>

          {/* Sinks / Loads (Below Bus) */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="polar-card p-3 text-center border-polar-800">
              <div className="text-xs font-semibold text-polar-300">HABITAT & LIVING</div>
              <div className="text-base font-mono font-semibold text-white mt-1">68.5 kW</div>
              <div className="text-[11px] text-polar-400 font-mono">Temp: {t?.thermal.living_zone_c || 20.4}°C</div>
            </div>

            <div className="polar-card p-3 text-center border-polar-800">
              <div className="text-xs font-semibold text-polar-300">LABS & SATELLITE COMMS</div>
              <div className="text-base font-mono font-semibold text-white mt-1">42.0 kW (C0 Critical)</div>
              <div className="text-[11px] text-emerald-400 font-mono">100% Uninterrupted</div>
            </div>

            <div className="polar-card p-3 text-center border-polar-800">
              <div className="text-xs font-semibold text-polar-300">SNOW MELT TANK</div>
              <div className="text-base font-mono font-semibold text-white mt-1">35.0 kW (Flexible)</div>
              <div className="text-[11px] text-polar-400 font-mono">Surplus Deferrable</div>
            </div>

            <div className="polar-card p-3 text-center border-polar-800">
              <div className="text-xs font-semibold text-polar-300">HVAC & VENTILATION</div>
              <div className="text-base font-mono font-semibold text-white mt-1">19.7 kW</div>
              <div className="text-[11px] text-polar-400 font-mono">ACH: 0.35 air/h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: Weather & Tank Autonomy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antarctic Station Environment */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Station Microclimate Reanalysis</h3>
            <span className="text-xs font-mono text-cyan-400">ERA5 Downscaled</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 mb-1">AIR TEMPERATURE</div>
              <div className="text-xl font-bold text-cyan-300">
                {t?.environment.t_out_c || -24.5}°C
              </div>
              <div className="text-[10px] text-polar-400 mt-1">Chill Factor: -42.8°C</div>
            </div>

            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 mb-1">KATABATIC WIND SPEED</div>
              <div className="text-xl font-bold text-teal-300">
                {t?.environment.wind_ms || 14.2} m/s
              </div>
              <div className="text-[10px] text-polar-400 mt-1">Gust Peak: 21.0 m/s</div>
            </div>

            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 mb-1">SOLAR GHI (POLAR NIGHT)</div>
              <div className="text-xl font-bold text-white">0.0 W/m²</div>
              <div className="text-[10px] text-polar-400 mt-1">Austral Winter Season</div>
            </div>

            <div className="p-3 rounded-lg bg-polar-950/70 border border-polar-800">
              <div className="text-polar-400 mb-1">SNOW-DRIFT INDEX</div>
              <div className="text-xl font-bold text-emerald-400">0.18 (LOW)</div>
              <div className="text-[10px] text-polar-400 mt-1">Movement Allowed</div>
            </div>
          </div>
        </div>

        {/* Resupply & Autonomy Corridor */}
        <div className="polar-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-white">Fuel Inventory & Autonomy Corridor</h3>
            <span className="text-xs font-mono text-emerald-400">Madrid RP 1130 Compliant</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-polar-400">Main Fuel Storage (L):</span>
              <span className="font-bold text-white">
                {t?.logistics.tank_level_l ? `${Math.round(t.logistics.tank_level_l).toLocaleString()} L` : '51,240 L'} / 80,000 L
              </span>
            </div>

            <div className="w-full bg-polar-950 rounded-full h-3 p-0.5 border border-polar-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all"
                style={{ width: `${((t?.logistics.tank_level_l || 51240) / 80000) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-polar-950/60 border border-polar-800">
                <div className="text-polar-400 text-[10px]">CURRENT BURN</div>
                <div className="font-semibold text-white mt-0.5">{t?.microgrid.total_fuel_lph || 28.5} L/h</div>
              </div>
              <div className="p-2 rounded bg-polar-950/60 border border-polar-800">
                <div className="text-polar-400 text-[10px]">CORRIDOR LIMIT</div>
                <div className="font-semibold text-white mt-0.5">38.0 L/h Max</div>
              </div>
              <div className="p-2 rounded bg-polar-950/60 border border-polar-800">
                <div className="text-polar-400 text-[10px]">SURVIVAL RESERVE</div>
                <div className="font-semibold text-amber-400 mt-0.5">5,000 L (Hard)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
