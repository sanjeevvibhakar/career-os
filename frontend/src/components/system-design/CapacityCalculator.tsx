import React, { useState } from 'react';
import { Calculator, Copy, Check, Sparkles, Database, HardDrive, Network, Cpu } from 'lucide-react';
import { soundService } from '../../services/soundService';

export const CapacityCalculator: React.FC = () => {
  const [dauMillions, setDauMillions] = useState<number>(50);
  const [readsPerUser, setReadsPerUser] = useState<number>(20);
  const [writesPerUser, setWritesPerUser] = useState<number>(2);
  const [payloadBytes, setPayloadBytes] = useState<number>(500);
  const [retentionYears, setRetentionYears] = useState<number>(5);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculations
  const totalDau = dauMillions * 1_000_000;
  const secondsPerDay = 86_400;

  const totalDailyReads = totalDau * readsPerUser;
  const totalDailyWrites = totalDau * writesPerUser;

  const avgReadQps = Math.round(totalDailyReads / secondsPerDay);
  const peakReadQps = Math.round(avgReadQps * 2);

  const avgWriteQps = Math.round(totalDailyWrites / secondsPerDay);
  const peakWriteQps = Math.round(avgWriteQps * 2);

  const dailyStorageBytes = totalDailyWrites * payloadBytes;
  const dailyStorageGb = (dailyStorageBytes / (1024 * 1024 * 1024)).toFixed(1);
  const totalStorageTb = ((dailyStorageBytes * 365 * retentionYears) / (1024 * 1024 * 1024 * 1024)).toFixed(1);

  // Bandwidth
  const egressMbPerSec = ((avgReadQps * payloadBytes) / (1024 * 1024)).toFixed(1);
  const ingressMbPerSec = ((avgWriteQps * payloadBytes) / (1024 * 1024)).toFixed(1);

  // 80/20 Caching rule (cache 20% of daily read volume)
  const memoryCacheGb = ((totalDailyReads * payloadBytes * 0.2) / (1024 * 1024 * 1024)).toFixed(1);

  const handleCopySummary = () => {
    const summary = `Back-of-the-Envelope Estimation (${dauMillions}M DAU):
• Read Throughput: ${avgReadQps.toLocaleString()} QPS (Peak: ${peakReadQps.toLocaleString()} QPS)
• Write Throughput: ${avgWriteQps.toLocaleString()} QPS (Peak: ${peakWriteQps.toLocaleString()} QPS)
• Storage: ${dailyStorageGb} GB/day (${totalStorageTb} TB over ${retentionYears} years)
• Network: Egress ${egressMbPerSec} MB/s | Ingress ${ingressMbPerSec} MB/s
• Cache Size (80-20 Rule): ~${memoryCacheGb} GB RAM`;

    navigator.clipboard.writeText(summary);
    soundService.playCheckSound();
    setCopiedKey('summary');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const applyPreset = (dau: number, reads: number, writes: number, bytes: number) => {
    setDauMillions(dau);
    setReadsPerUser(reads);
    setWritesPerUser(writes);
    setPayloadBytes(bytes);
    soundService.playCheckSound();
  };

  return (
    <div className="space-y-4">
      {/* 1. Preset Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 text-xs font-mono">
        <span className="text-gray-400 font-bold shrink-0">Scale Presets:</span>
        <button
          onClick={() => applyPreset(50, 20, 2, 500)}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
        >
          Social Feed (50M DAU)
        </button>
        <button
          onClick={() => applyPreset(100, 50, 20, 200)}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
        >
          Chat App (100M DAU)
        </button>
        <button
          onClick={() => applyPreset(20, 100, 1, 300)}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
        >
          TinyURL (20M DAU)
        </button>
        <button
          onClick={() => applyPreset(10, 5, 2, 1024)}
          className="shrink-0 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
        >
          Payment Ledger (10M DAU)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Form: Sliders & Inputs */}
        <div className="lg:col-span-5 glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-sky-400 flex items-center gap-1.5">
              <Calculator size={14} /> System Parameters
            </span>
            <span className="text-[11px] font-mono text-gray-400">Live Reactive Math</span>
          </div>

          {/* Parameter 1: DAU */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-gray-300">Daily Active Users (DAU):</label>
              <strong className="text-white">{dauMillions}M Users</strong>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              value={dauMillions}
              onChange={(e) => setDauMillions(Number(e.target.value))}
              className="w-full accent-blue-500 bg-white/10 rounded-lg h-2"
            />
          </div>

          {/* Parameter 2: Reads per user */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-gray-300">Reads per user / day:</label>
              <strong className="text-white">{readsPerUser} reads</strong>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={readsPerUser}
              onChange={(e) => setReadsPerUser(Number(e.target.value))}
              className="w-full accent-purple-500 bg-white/10 rounded-lg h-2"
            />
          </div>

          {/* Parameter 3: Writes per user */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-gray-300">Writes per user / day:</label>
              <strong className="text-white">{writesPerUser} writes</strong>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={writesPerUser}
              onChange={(e) => setWritesPerUser(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-white/10 rounded-lg h-2"
            />
          </div>

          {/* Parameter 4: Payload size */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-gray-300">Average Payload Size:</label>
              <strong className="text-white">{payloadBytes} Bytes</strong>
            </div>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={payloadBytes}
              onChange={(e) => setPayloadBytes(Number(e.target.value))}
              className="w-full accent-amber-500 bg-white/10 rounded-lg h-2"
            />
          </div>

          {/* Parameter 5: Retention */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <label className="text-gray-300">Retention Horizon:</label>
              <strong className="text-white">{retentionYears} Years</strong>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={retentionYears}
              onChange={(e) => setRetentionYears(Number(e.target.value))}
              className="w-full accent-rose-500 bg-white/10 rounded-lg h-2"
            />
          </div>
        </div>

        {/* Right Output: Telemetry Cards */}
        <div className="lg:col-span-7 space-y-3">
          
          {/* Top Banner with Copy Button */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-bold text-gray-400">
              ESTIMATED ARCHITECTURAL DEMAND:
            </span>
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copiedKey === 'summary' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedKey === 'summary' ? 'Copied to Clipboard!' : 'Copy Interview Summary'}</span>
            </button>
          </div>

          {/* 4 Architectural Telemetry KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* KPI 1: Read Throughput */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-blue-400 font-bold">
                <span className="flex items-center gap-1.5"><Cpu size={13} /> READ THROUGHPUT</span>
                <span>Peak ~2x</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {avgReadQps.toLocaleString()} <span className="text-xs text-gray-400 font-normal">QPS</span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Peak capacity required: <strong>{peakReadQps.toLocaleString()} QPS</strong>
              </p>
            </div>

            {/* KPI 2: Write Throughput */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5"><Network size={13} /> WRITE THROUGHPUT</span>
                <span>Writes/sec</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {avgWriteQps.toLocaleString()} <span className="text-xs text-gray-400 font-normal">QPS</span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Peak write spikes: <strong>{peakWriteQps.toLocaleString()} QPS</strong>
              </p>
            </div>

            {/* KPI 3: Storage Capacity */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-400 font-bold">
                <span className="flex items-center gap-1.5"><HardDrive size={13} /> STORAGE VOLUME</span>
                <span>{retentionYears}yr Horizon</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {dailyStorageGb} <span className="text-xs text-gray-400 font-normal">GB / day</span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Total persistent disk: <strong>{totalStorageTb} TB</strong>
              </p>
            </div>

            {/* KPI 4: RAM Cache & Network */}
            <div className="p-4 rounded-xl glass-panel border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 font-bold">
                <span className="flex items-center gap-1.5"><Database size={13} /> CACHE & BANDWIDTH</span>
                <span>80-20 Rule</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                ~{memoryCacheGb} <span className="text-xs text-gray-400 font-normal">GB RAM</span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                Egress: <strong>{egressMbPerSec} MB/s</strong> • Ingress: <strong>{ingressMbPerSec} MB/s</strong>
              </p>
            </div>

          </div>

          {/* Quick Verbal Explanation Checklist */}
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs font-mono text-blue-200 leading-relaxed">
            <strong className="text-blue-300 block mb-1">💡 How to verbalize this in an interview:</strong>
            "Assuming {dauMillions}M DAU and {readsPerUser} reads/user/day, our system processes approximately <strong>{avgReadQps.toLocaleString()} QPS</strong> with peak spikes near <strong>{peakReadQps.toLocaleString()} QPS</strong>. At {payloadBytes}B per record, we ingest <strong>{dailyStorageGb} GB</strong> daily, totaling <strong>{totalStorageTb} TB</strong> over {retentionYears} years. To achieve sub-10ms P99 latency, caching 20% of daily read working set requires <strong>~{memoryCacheGb} GB</strong> in a Redis cluster."
          </div>

        </div>
      </div>
    </div>
  );
};
