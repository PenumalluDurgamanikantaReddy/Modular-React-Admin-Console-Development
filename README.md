# Google — Modular Admin Console (Micro-Frontend Architecture)

A production-grade, highly scalable **React 19 + TypeScript** administrative web application demonstrating **Micro-Frontend-inspired modular architecture**, isolated Redux Toolkit state slices, MSW (Mock Service Worker) API simulation, Material UI v6 + Tailwind CSS styling, Recharts analytics telemetry, and comprehensive unit/integration testing.

---

## 🌟 Architectural Overview

This application simulates a production **Module Federation (Micro-Frontend)** architecture where three domain modules function as independent domain boundaries:

```
                          ┌──────────────────────────┐
                          │   Host App / Shell Shell │
                          │  (Router, Layout, Auth)  │
                          └────────────┬─────────────┘
                                       │ Dynamic Import / Suspense
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│ Module 1: Users       │  │ Module 2: Analytics   │  │ Module 3: Settings    │
│  - UsersTable         │  │  - Telemetry KPIs     │  │  - ProfileForm        │
│  - UserModal          │  │  - Recharts (Area/Bar)│  │  - ThemeToggle        │
│  - usersSlice         │  │  - analyticsSlice     │  │  - settingsSlice      │
└───────────────────────┘  └───────────────────────┘  └───────────────────────┘
```

### Module Federation Mapping to Production
In a live production environment with Webpack Module Federation or `@originjs/vite-plugin-federation`:

- Each folder under `/src/modules/<name>` is structured as an **exposed remote package**.
- Each module exports an `index.ts` declaring the federation boundary (see comments in `src/modules/users/index.ts`).
- Root Redux store slices are registered dynamically per module boundary.
- Per-module **React Error Boundaries** ensure that if one module fails, the remaining console modules remain operational.

---

## 🚀 Key Features

### 🏢 Module 1: User Management
- **Interactive Data Table**: Server-side debounced search, column sorting, pagination (10/25/50 per page).
- **Multi-Select & Bulk Actions**: Select multiple users for bulk deletion with confirmation dialog.
- **CSV Export**: Export current table filter/selection directly into standard CSV format.
- **CRUD Operations**: Add, Edit, and Delete users via modal form with instant optimistic state updates.
- **Form Validation**: Strict schema validation using `react-hook-form` + `zod`.

### 📊 Module 2: Telemetry Analytics
- **Live Metric Cards**: Total users, active sessions, conversion rate with trend indicators (↑/↓).
- **Recharts Data Visualization**:
  - **Area Chart**: Daily Active Users (DAU) over 7, 14, or 30 days.
  - **Bar Chart**: Module interactions broken down by department.
  - **Donut Chart**: User role distribution.
- **Live Telemetry Refresh**: Automated 30-second background polling with countdown timer and manual sync override.

### ⚙️ Module 3: Settings & Preferences
- **User Profile Management**: Edit display name, contact email, bio, timezone, and avatar preview.
- **Appearance Settings**: Toggle between **Dark Mode**, **Light Mode**, and System presets, plus custom accent color picker.
- **Notification Matrix**: Channel toggles for Email, Push, SMS, and digest schedule.
- **Redux & LocalStorage Persistence**: Settings persist across reloads and tab navigation.

### 🛡️ Module 4: Security Audit Log & Extra Enterprise Features
- **Audit Log Trail**: Historical log of administrative operations (CREATE, UPDATE, DELETE, EXPORT).
- **Command Palette (`Ctrl + K`)**: Keyboard-navigable quick actions & module shortcuts.
- **Notifications Dropdown**: Real-time alert notifications with unread count badge.
- **Role-Based Access Control (RBAC)**: Permission tiers (Admin, Manager, Editor, Viewer).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript (Strict Mode) |
| **Build System** | Vite 6 (Netlify Compatible) |
| **Routing** | React Router v6 |
| **State Management** | Redux Toolkit (`combineReducers` slice isolation) |
| **UI Components** | Material UI (MUI v6) |
| **Utility Layout** | Tailwind CSS v3 |
| **Mock REST API** | MSW v2 (Mock Service Worker) |
| **Forms & Validation** | React Hook Form + Zod |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Testing** | Jest + React Testing Library |

---

## 📁 Project Directory Structure

```
google/
├── public/
│   └── mockServiceWorker.js       # MSW Browser Worker
├── src/
│   ├── main.tsx                   # MSW Initialization & Redux Provider
│   ├── App.tsx                    # Root App & Suspense Lazy Router
│   ├── store/
│   │   ├── rootStore.ts           # Central Store & Redux Hooks
│   │   ├── authSlice.ts           # Authentication & Permission State
│   │   └── notificationsSlice.ts  # Global Notifications State
│   ├── shared/
│   │   ├── components/            # Sidebar, Topbar, ShellLayout, CommandPalette, ErrorBoundary
│   │   ├── theme/                 # MUI Custom Dark/Light Themes
│   │   └── types/                 # Shared TypeScript Contracts & Interfaces
│   ├── mocks/
│   │   ├── db.ts                  # Seed Database (50 Users, Audit Trail, Telemetry)
│   │   ├── browser.ts             # MSW Worker Setup
│   │   └── handlers/              # REST Mock Handlers for Users & Analytics
│   └── modules/
│       ├── users/                 # Module 1 Boundary
│       │   ├── index.ts           # Federation Remote Export & Documentation
│       │   ├── UsersModule.tsx    # Root View
│       │   ├── slice/             # Module-owned RTK Slice
│       │   ├── components/        # UsersTable, UserModal, UserFilters, UserRoleBadge
│       │   └── __tests__/         # Unit & Integration Tests
│       ├── analytics/             # Module 2 Boundary
│       │   ├── AnalyticsModule.tsx
│       │   ├── slice/
│       │   └── components/        # MetricCard, LineChartWidget, BarChartWidget, PieChartWidget
│       ├── settings/              # Module 3 Boundary
│       │   ├── SettingsModule.tsx
│       │   ├── slice/
│       │   └── components/        # ProfileForm, ThemeToggle, NotificationPrefs
│       └── audit/                 # Module 4 Boundary
│           └── AuditModule.tsx
├── jest.config.ts                 # Jest Test Runner Configuration
├── netlify.toml                   # Netlify Static Deployment Spec
└── vite.config.ts                 # Chunk Splitting & Path Aliases
```

---

## 🧪 Running Tests

Unit and integration tests are powered by **Jest** and **React Testing Library**.

```bash
# Run unit & integration test suite
npm test

# Run tests in watch mode
npm test -- --watch
```

Test Coverage includes:
- **`UsersTable.test.tsx`**: Validates row rendering from store state, sort order, and edit callbacks.
- **`UserModal.test.tsx`**: Validates Zod schema error triggers and form field pre-filling.
- **`usersSlice.test.ts`**: Tests Redux reducer state transitions, optimistic deletes, and filter states.

---

## 📦 Running Locally & Building for Production

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. MSW will intercept mock REST calls automatically.

### 3. Production Build
```bash
npm run build
```
Generates a static SPA distribution in `/dist` ready for Netlify.

---

## ☁️ Netlify Deployment

This project is pre-configured for static deployment on **Netlify**:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirects pre-configured in `netlify.toml`
