# Tadawul Insight - Saudi Market Analytics

## Overview

Tadawul Insight is a financial analytics web application for tracking and analyzing stocks on the Saudi Exchange (Tadawul). The platform provides market overview dashboards, individual stock analysis, price charts, and financial data visualization with bilingual support (English/Arabic).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and data fetching
- **Styling**: Tailwind CSS v4 with CSS variables for theming, dark theme by default
- **UI Components**: shadcn/ui component library (New York style variant) built on Radix UI primitives
- **Charts**: Recharts library for financial data visualization
- **Internationalization**: Custom LanguageContext supporting English and Arabic with RTL layout support

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints under `/api` prefix
- **External Data**: Yahoo Finance API integration for real-time stock data with fallback mock data
- **Build Tool**: esbuild for server bundling, Vite for client

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains database table definitions
- **Current Storage**: In-memory storage implementation (`MemStorage`) with interface for future database migration
- **Session Storage**: connect-pg-simple available for PostgreSQL session storage

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # UI components (shadcn/ui + custom)
│   │   ├── pages/        # Route page components
│   │   ├── lib/          # Utilities, API hooks, context
│   │   └── hooks/        # Custom React hooks
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   └── storage.ts    # Data storage abstraction
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
└── migrations/       # Database migrations output
```

### Key Design Decisions

1. **Monorepo Structure**: Client and server share TypeScript configuration and can import from `@shared/*` path alias, enabling type-safe API contracts.

2. **Component Architecture**: Uses shadcn/ui which provides unstyled, accessible components that are copied into the codebase for full customization control.

3. **Bilingual Support**: Built-in RTL support with language context, allowing seamless switching between English and Arabic interfaces.

4. **API Caching Strategy**: React Query configured with `staleTime: Infinity` and disabled refetch on window focus, optimized for financial data that updates at specific intervals.

5. **Development/Production Split**: Vite dev server with HMR in development, static file serving from built assets in production.

## External Dependencies

### Third-Party APIs
- **Yahoo Finance API**: Primary data source for stock prices, market indices, and OHLC data (`query1.finance.yahoo.com`)

### Database
- **PostgreSQL**: Required for production (DATABASE_URL environment variable)
- **Drizzle Kit**: Database migration and schema push tooling

### Key npm Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` / `drizzle-zod`: Database ORM with Zod schema integration
- `recharts`: Charting library for financial visualizations
- `wouter`: Lightweight client-side routing
- `express-session` / `connect-pg-simple`: Session management
- Radix UI primitives: Accessible UI component foundations