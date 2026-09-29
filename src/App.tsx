import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewView } from './views/OverviewView';
import { ShipWindowView } from './views/ShipWindowView';
import { MicrogridView } from './views/MicrogridView';
import { HealthView } from './views/HealthView';
import { AgentArenaView } from './views/AgentArenaView';
import { SatlinkView } from './views/SatlinkView';
import { ComplianceView } from './views/ComplianceView';
import { HeroDemoView } from './views/HeroDemoView';
import { TelemetryData } from './types';

export const App: React.FC = () => {
  const [station, setStation] = useState<string>('maitri');
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [linkOnline, setLinkOnline] = useState<boolean>(true);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

  // Simulated Telemetry generator / WebSocket consumer
  useEffect(() => {
    let ws: WebSocket | null = null;
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;
    let stepCount = 0;

    const setupFallbackSimulation = () => {
      fallbackInterval = setInterval(() => {
        stepCount += 1;
        const hour = (stepCount / 20.0) % 24.0;
        const temp = -24.5 + 4.0 * Math.sin((2 * Math.PI * hour) / 24.0);
        const wind = 14.2 + 3.0 * Math.cos((2 * Math.PI * hour) / 24.0);
        const load = 165.0 + 20.0 * Math.sin((2 * Math.PI * hour) / 24.0);
        const g1 = Math.min(125.0, load * 0.55);
        const g2 = Math.max(35.0, load - g1);

        setTelemetry({
          timestamp: new Date().toISOString(),
          step: stepCount,
          environment: {
            t_out_c: Math.round(temp * 10) / 10,
            wind_ms: Math.round(wind * 10) / 10,
            solar_wm2: 0.0,
            snowfall_mm: 0.0,
          },
          microgrid: {
            load_kw: Math.round(load * 10) / 10,
            genset1_kw: Math.round(g1 * 10) / 10,
            genset2_kw: Math.round(g2 * 10) / 10,
            genset3_kw: 0.0,
            total_fuel_lph: Math.round((4.5 + 0.22 * g1 + 4.5 + 0.22 * g2) * 10) / 10,
            battery_soc: Math.round((0.78 + 0.03 * Math.sin(hour)) * 100) / 100,
            battery_kw: 1.2,
          },
          thermal: {
            living_zone_c: 20.4,
            lab_zone_c: 19.8,
            generator_hall_c: 15.2,
            waste_heat_kw: Math.round((g1 + g2) * 0.42 * 10) / 10,
          },
          fdir: {
            status: 'HEALTHY',
            active_incidents: 0,
            anomaly_score: 0.04,
            virtual_fuel_residual: 0.12,
          },
          logistics: {
            tank_level_l: Math.round(51240.0 - stepCount * 0.2),
            autonomy_days_p50: 182.4,
            corridor_status: 'NORMAL',
          },
          link: {
            online: linkOnline,
            uplink_kbps: linkOnline ? 64.0 : 0.0,
            queue_depth_p0: 0,
            queue_depth_p1: linkOnline ? 4 : 142,
          },
        });
      }, 1000);
    };

    // Try WebSocket connection
    try {
      ws = new WebSocket('ws://localhost:8000/api/scenarios/ws/telemetry');
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setTelemetry(data);
        } catch {}
      };
      ws.onerror = () => {
        setupFallbackSimulation();
      };
      ws.onclose = () => {
        if (!fallbackInterval) setupFallbackSimulation();
      };
    } catch {
      setupFallbackSimulation();
    }

    return () => {
      if (ws) ws.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [linkOnline]);

  return (
    <div className="min-h-screen bg-polar-950 flex flex-col font-sans">
      <Header
        station={station}
        setStation={setStation}
        telemetry={telemetry}
        linkOnline={linkOnline}
        setLinkOnline={setLinkOnline}
      />

      <div className="flex flex-1 overflow-hidden">
        <Navigation currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
          {currentTab === 'overview' && (
            <OverviewView station={station} telemetry={telemetry} onNavigate={setCurrentTab} />
          )}
          {currentTab === 'ship-window' && <ShipWindowView telemetry={telemetry} />}
          {currentTab === 'microgrid' && <MicrogridView telemetry={telemetry} />}
          {currentTab === 'health' && <HealthView telemetry={telemetry} />}
          {currentTab === 'agents' && <AgentArenaView telemetry={telemetry} />}
          {currentTab === 'satlink' && (
            <SatlinkView
              telemetry={telemetry}
              linkOnline={linkOnline}
              setLinkOnline={setLinkOnline}
            />
          )}
          {currentTab === 'compliance' && <ComplianceView />}
          {currentTab === 'hero-demo' && <HeroDemoView station={station} />}
        </main>
      </div>
    </div>
  );
};

export default App;
