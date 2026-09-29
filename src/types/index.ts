export interface TelemetryData {
  timestamp: string;
  step: number;
  environment: {
    t_out_c: number;
    wind_ms: number;
    solar_wm2: number;
    snowfall_mm: number;
  };
  microgrid: {
    load_kw: number;
    genset1_kw: number;
    genset2_kw: number;
    genset3_kw: number;
    total_fuel_lph: number;
    battery_soc: number;
    battery_kw: number;
  };
  thermal: {
    living_zone_c: number;
    lab_zone_c: number;
    generator_hall_c: number;
    waste_heat_kw: number;
  };
  fdir: {
    status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
    active_incidents: number;
    anomaly_score: number;
    virtual_fuel_residual: number;
  };
  logistics: {
    tank_level_l: number;
    autonomy_days_p50: number;
    corridor_status: string;
  };
  link: {
    online: boolean;
    uplink_kbps: number;
    queue_depth_p0: number;
    queue_depth_p1: number;
  };
}

export interface ScenarioStep {
  step_id: number;
  title: string;
  phase: string;
  details: string;
  impacts: Record<string, any>;
  agent_actions: Array<{
    agent: string;
    action: string;
    status: string;
  }>;
  telemetry_sample: Record<string, number>;
}

export interface HeroDemoResponse {
  status: string;
  station: string;
  summary: string;
  timeline: ScenarioStep[];
  kpis: {
    fuel_autonomy_days_gained: number;
    peak_shadow_price_kwh: number;
    survival_invariants_violated: number;
    sync_compression_ratio: string;
    fdir_isolation_confidence: number;
    lead_time_hours: number;
  };
}

export interface LedgerRecord {
  index: number;
  timestamp: string;
  record_type: string;
  data: Record<string, any>;
  prev_hash: string;
  hash: string;
}

export interface FaultHypothesis {
  fault: string;
  probability: number;
}
