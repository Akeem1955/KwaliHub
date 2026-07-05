# WASH-AI Nexus 🌍💧

**The WASH-AI Nexus** is a simulation platform designed to model and manage Water, Sanitation, and Hygiene (WASH) infrastructure across 15 communities in the Kwali Area Council, Nigeria. 

By combining **IoT Sensor Data**, a **Digital Twin Simulation**, and **Generative AI** (powered by Gemini), the platform aims to predict pump failures, track revenue, and automatically generate sustainable business models and behavioral nudges to keep community water points operational.

---

## 🚀 Tech Stack

- **Framework**: Next.js (App Router, React 19)
- **Styling**: Tailwind CSS & Framer Motion (for fluid, sleek animations)
- **Database**: SQLite with Prisma ORM
- **Mapping**: `react-leaflet` for interactive spatial dashboards
- **Charting**: `recharts` for historical IoT telemetry (Flow Rate, Energy Use)
- **Generative AI**: `@google/genai` (Gemini 2.5 Flash)

---

## 🧠 Core Features

1. **Digital Twin Engine**: Models 15 water terminals. Tracks live flow rate, pump status (`OPERATIONAL`, `DEGRADED`, `BROKEN`), and energy consumption.
2. **Generative AI Problem Solving**: When a terminal is degraded or struggling with revenue, the system uses Gemini to generate localized business models (strictly constrained to 8 approved sustainable models) and behavioral SMS nudges.
3. **Interactive WASH Map**: A rich, layer-based map for the WASH Unit to monitor sensor health in real-time, complete with a "Prediction Layer" that highlights terminals at risk of failing.
4. **Role-Based Dashboards**: 
   - `Admin` (WASH Unit): High-level map and oversight.
   - `Steward`: Mobile-first dashboard for local operators to report revenue.
   - `Panel` (WASH Lab): Review and approve AI-generated business proposals.

---

## 🛠️ Local Setup & Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file at the root of the project (you can copy `.env.example`). You must add a valid Gemini API key for the AI generation to work.
```env
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 3. Database Initialization & Seeding
Push the Prisma schema to create the SQLite database, then start the dev server:
```bash
npx prisma db push
npm run dev
```

**Seed the Database:**
Once the server is running on `http://localhost:3000`, populate the 15 communities and their historical IoT data by hitting the backfill endpoint. You can do this in your terminal or via an API client (like Postman):
```bash
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/simulate/backfill" -Method POST

# Using cURL
curl -X POST http://localhost:3000/api/simulate/backfill
```

### 4. Running the Digital Twin AI
To analyze the current state of the terminals and let Gemini generate new business proposals and nudges based on anomalies, hit the twin process endpoint:
```bash
# Using PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/twin/process" -Method POST

# Using cURL
curl -X POST http://localhost:3000/api/twin/process
```

---

## 📂 Project Structure Highlights
- `src/lib/digitalTwin.ts`: Contains the Gemini prompt constraints and generation logic.
- `src/components/WashMap.tsx` & `TerminalDetailPanel.tsx`: The interactive map and the fluid slide-out details panel.
- `prisma/schema.prisma`: Defines the data models (`Terminal`, `Steward`, `SensorReading`, `Household`, `Proposal`, etc.).
- `src/app/api/simulate/backfill/route.ts`: Logic for generating synthetic historical telemetry data.
