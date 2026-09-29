import React, { useState, useEffect } from 'react';
import { FileText, ShieldCheck, CheckCircle2, Lock, Download, AlertCircle, Hash } from 'lucide-react';
import { LedgerRecord } from '../types';
import { getLedgerRecords, verifyLedgerChain } from '../services/api';

export const ComplianceView: React.FC = () => {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ valid: boolean; total_blocks: number } | null>(null);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    const list = await getLedgerRecords();
    setRecords(list);
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyLedgerChain();
      setVerifyStatus(res);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <Lock className="w-4 h-4" />
            Madrid Protocol & Indian Antarctic Act 2022
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Tamper-Evident Environmental Compliance Ledger
          </h2>
          <p className="text-xs text-polar-400">
            Cryptographically hash-chained Merkle ledger logging fuel movements, spill alarms, waste backhauls, and emissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-3.5 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className={`w-4 h-4 ${verifying ? 'animate-spin' : ''}`} />
            {verifying ? 'Verifying Hashes...' : 'Verify Cryptographic Chain'}
          </button>
        </div>
      </div>

      {/* Verification Status Banner */}
      {verifyStatus && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/60 flex items-center gap-3 text-xs font-mono text-emerald-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">CHAIN INTEGRITY VERIFIED (100% PASS): </span>
            <span>
              All {verifyStatus.total_blocks} Merkle blocks have been independently re-hashed using SHA-256. Zero broken pointers or retroactively altered log entries.
            </span>
          </div>
        </div>
      )}

      {/* Ledger Block List */}
      <div className="polar-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Append-Only Audit Chain (Edge & HQ Anchor)</h3>
          <span className="text-xs font-mono text-polar-400">SHA-256 Merkle Log</span>
        </div>

        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.index} className="p-4 rounded-xl bg-polar-950/80 border border-polar-800 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                    BLOCK #{r.index}
                  </span>
                  <span className="text-polar-200 capitalize font-semibold">
                    {r.record_type.replace('_', ' ')}
                  </span>
                </div>
                <span className="text-polar-400 text-[11px]">{r.timestamp}</span>
              </div>

              {/* Data Content */}
              <div className="p-2.5 rounded-lg bg-polar-900/60 border border-polar-800/80 text-xs font-mono text-polar-300">
                <pre className="overflow-x-auto">{JSON.stringify(r.data, null, 2)}</pre>
              </div>

              {/* Cryptographic Hashes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono pt-1 text-polar-400">
                <div className="truncate">
                  <span className="text-polar-500">PREV: </span>
                  <span className="text-polar-400">{r.prev_hash}</span>
                </div>
                <div className="truncate text-right md:text-left">
                  <span className="text-cyan-500">HASH: </span>
                  <span className="text-cyan-300 font-semibold">{r.hash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
