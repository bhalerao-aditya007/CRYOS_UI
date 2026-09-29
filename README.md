# CRYOS UI — Antarctic Digital Twin Dashboard

Mission-critical telemetry dashboard and multi-agent operations HUD for Indian Antarctic research stations (**Maitri** & **Bharati**).

Built with React 18, Vite, TypeScript, and Tailwind CSS. Configured for zero-config deployment on **Vercel**.

---

## ❄️ Features
- **Polar Night Dark Theme:** Low-blue high-contrast palette tailored for polar night control rooms and glove-friendly touch targets.
- **Station Overview:** Single-line electrical bus topology, 1-min telemetry HUD, and downscaled Antarctic microclimate weather cards.
- **Ship Window Clock:** Resupply ship countdown, P10/P50/P90 Autonomy Days fan chart, and SAA burn corridor limits.
- **Microgrid & Thermal:** 3x Genset merit-order dispatch, Willans curves, waste-heat hydronic recovery loop, and BESS storage.
- **ISHM / FDIR Diagnostics:** Model 1 Virtual Sensor analytical redundancy, Model 6 Bayesian isolation network, and Model 5 RUL prognostics.
- **Multi-Agent Arena:** ADMM market coordination with shadow prices doubling as auditable explanations ("Why?"), and Simplex 72h sandbox forward verification.
- **Twin-as-Codec:** 300x bandwidth compression demo over 64kbps satlinks with expanding and collapsing uncertainty cones.
- **Madrid Protocol Ledger:** Merkle SHA-256 hash-chain environmental compliance audit log.
- **Hero Crisis Demo:** One-click composite disaster simulation: Blizzard (72h) + Genset 2 degradation + Ship delayed 3 weeks + Satlink blackout.

---

## 🚀 Deployment to Vercel
1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite** (auto-detected via `vercel.json`).
3. Set Environment Variable:
   - `VITE_API_BASE_URL`: URL of your deployed Railway backend (e.g. `https://your-backend.up.railway.app`).
4. Click **Deploy**.

---

## 💻 Local Development
```bash
npm install
npm run dev
```
Runs at `http://localhost:3000`.
