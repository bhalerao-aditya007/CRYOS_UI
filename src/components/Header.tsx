import React, { useState, useEffect } from 'react';
import { Radio, Wifi, WifiOff, ShieldCheck, Thermometer, Wind, AlertTriangle, Compass } from 'lucide-react';
import { TelemetryData } from '../types';

interface HeaderProps {
  station: string;
  setStation: (station: string) => void;
  telemetry: TelemetryData | null;
  linkOnline: boolean;
  setLinkOnline: (online: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  station,
  setStation,
  telemetry,
  linkOnline,
  setLinkOnline,
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-polar-800 bg-polar-900/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Brand & Station Selector */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-mono font-bold text-black text-lg">
            CR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-wider text-white">CRYOS</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-widest bg-cyan-950 text-cyan-400 border border-cyan-800">
                TWIN v1.0
              </span>
            </div>
            <p className="text-xs text-polar-300">Antarctic Resilient Digital Twin (PS 26060)</p>
          </div>
        </div>

        {/* Station Toggle */}
        <div className="flex items-center bg-polar-950 p-1 rounded-lg border border-polar-800">
          <button
            onClick={() => setStation('maitri')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              station.toLowerCase() === 'maitri'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-polar-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Maitri (70.8°S)
          </button>
          <button
            onClick={() => setStation('bharati')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              station.toLowerCase() === 'bharati'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-polar-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Bharati (69.4°S)
          </button>
        </div>
      </div>

      {/* Real-Time Ambient Meters */}
      <div className="flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-polar-950/70 border border-polar-800">
          <Thermometer className="w-4 h-4 text-cyan-400" />
          <span className="text-polar-400">OUTDOOR:</span>
          <span className="font-semibold text-white">
            {telemetry?.environment.t_out_c !== undefined ? `${telemetry.environment.t_out_c}°C` : '-24.5°C'}
          </span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-polar-950/70 border border-polar-800">
          <Wind className="w-4 h-4 text-teal-400" />
          <span className="text-polar-400">WIND:</span>
          <span className="font-semibold text-white">
            {telemetry?.environment.wind_ms !== undefined ? `${telemetry.environment.wind_ms} m/s` : '14.2 m/s'}
          </span>
        </div>

        {/* Satellite Link Toggle & Status */}
        <button
          onClick={() => setLinkOnline(!linkOnline)}
          title="Click to simulate 72h satellite link blackout"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            linkOnline
              ? 'bg-emerald-950/50 border-emerald-600/50 text-emerald-400 hover:bg-emerald-900/40'
              : 'bg-rose-950/60 border-rose-600/70 text-rose-300 animate-pulse-slow'
          }`}
        >
          {linkOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span>{linkOnline ? 'SATLINK 64kbps (SYNC)' : 'LINK OUTAGE (COASTING)'}</span>
        </button>

        {/* UTC Clock */}
        <div className="text-polar-400 hidden xl:block font-mono tracking-tight">
          {utcTime}
        </div>
      </div>
    </header>
  );
};
