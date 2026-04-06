# Finance Dashboard

A responsive finance dashboard built with React and Vite for tracking balances, transactions, spending patterns, and role-based UI behavior.

## Overview

This project was built as a frontend dashboard assignment. It focuses on presenting financial activity clearly through summary cards, charts, transaction management, insights, and a simple role-based experience.

The app supports a mock API through `json-server`, but it also falls back to local demo data if the mock server is not running.

## Features

- Dashboard overview with summary cards for `Balance`, `Income`, `Expenses`, and `Savings`
- Time-based visualization with a balance trend chart
- Category-based visualization for income and expense breakdown
- Transactions table with:
  - date
  - category
  - type
  - amount
  - filtering
  - sorting
  - category search
- Dashboard-level search for sections and finance categories
- Insights section with spending observations and monthly comparison
- Role-based UI with `admin` and `viewer`
- Add, edit, and delete transaction flows for admin
- Dark and light mode with persistence
- CSV export
- Mock API support with fallback demo data
- Responsive layout for desktop and mobile

## Roles

### Admin

- Can view the full dashboard
- Can add transactions
- Can edit transactions
- Can delete transactions
- Can open the admin panel

### Viewer

- Read-only access
- Can view cards, charts, transactions, and insights
- Cannot add, edit, or delete transactions
- Cannot access the admin panel

## Demo Credentials

- `admin / admin123`
- `viewer / viewer123`

## Key Interactions

- `History` on the balance card switches the trend chart to the latest 4 months
- The top search bar supports dashboard terms such as `balance`, `income`, `expenses`, `savings`, `transactions`, and `insights`
- The top search bar also supports finance categories such as `rent`, `salary`, `shopping`, `food`, and `travel`
- Sidebar icons navigate to real dashboard sections
- Sidebar status dots indicate data state:
  - green = API connected
  - yellow = fallback/demo data or loading
  - red = API error

## Tech Stack

- React
- Vite
- Tailwind CSS
- Recharts
- Context API
- json-server
- Lucide React

## Project Structure

- `src/Pages/DashBoard.jsx` main dashboard layout
- `src/Pages/Login.jsx` login screen
- `src/Pages/AdminPanel.jsx` admin-only page
- `src/Context/AuthContext.jsx` authentication and role state
- `src/Context/FinanceContext.jsx` transaction data, filters, and mock API integration
- `src/hooks/useFinancedata.js` derived metrics, insights, and chart data
- `src/components/TransactionsTable.jsx` transactions UI and admin actions
- `src/components/Charts/BalanceChart.jsx` time-based chart
- `src/components/Charts/CategoryPie.jsx` category breakdown chart
- `src/components/layout/HeadBar.jsx` top bar actions and dashboard search
- `src/components/layout/SideBar.jsx` section navigation and app status

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the mock API

```bash
npm run server
```

This starts `json-server` with [db.json](/Users/hasmithasiddani_siri/Desktop/finance-dashboard/db.json) on:

```bash
http://localhost:3001
```

Transactions endpoint:

```bash
http://localhost:3001/transactions
```

### 3. Run the frontend

```bash
npm run dev
```

Vite usually starts the app on:

```bash
http://localhost:5173
```

## Available Scripts

- `npm run dev` starts the frontend
- `npm run server` starts the mock API
- `npm run build` creates a production build
- `npm run lint` runs ESLint
- `npm run preview` previews the production build

## Technical Decisions

- Used `React + Vite` for a fast development workflow and a simple component-based structure
- Used `Context API` because the shared state is moderate and centered around auth, transactions, and filters
- Used `json-server` to simulate realistic CRUD flows without building a backend
- Used `Recharts` for quick dashboard-oriented chart integration
- Used `Tailwind CSS` with theme styling for responsive layout and dark/light mode support
- Used frontend-only role simulation because the assignment required UI-level role behavior, not secure backend authorization

## Trade-offs

- `Context API` keeps the app simple, but would become harder to scale in a much larger product
- `json-server` makes the demo realistic, but it is not a true backend with real auth or server-side validation
- Role-based access is UI-only and should not be treated as secure authorization
- `Recharts` helped ship quickly, but increases bundle size
- The app is built as a single-page dashboard with section navigation rather than a full multi-page product

## Notes

- If the mock API is not running, the app falls back to local demo transactions
- Authentication is local and intended only for demo purposes
- This project is optimized for assignment/demo use rather than production deployment
