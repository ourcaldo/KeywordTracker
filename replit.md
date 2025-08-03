# Overview

This project is a keyword tracking SEO application built with Next.js and TypeScript. Its primary purpose is to help users monitor and analyze their SEO rankings by tracking keyword performance over time. Key capabilities include a modern web interface, robust authentication, and a dashboard for managing keyword tracking activities. The application aims to provide a comprehensive solution for SEO professionals and businesses to gain insights into their search engine visibility.

# User Preferences

Preferred communication style: Simple, everyday language.

Database preferences: 
- Use Supabase directly through the dashboard/SQL editor
- Never ask for DATABASE_URL secret - work with existing .env setup
- Provide SQL queries directly in chat when database changes are needed
- User profiles use first_name and last_name (not full_name)
- Display name should be first_name only

# Recent Changes & Progress

## Authentication System Updates
- Fixed signup form to use first_name and last_name instead of full_name
- Updated user profile display to show first_name only
- Fixed 500 Internal Server Error during signup
- Database schema updated for first_name/last_name columns

## Dashboard & UI Improvements
- Replaced ugly prompt() dialogs with beautiful modal forms
- Fixed workspace creation flow - users must create workspace first, then add domains
- Fixed modal display issues with proper CSS classes
- Maintained white background with glass effects design
- Icon-only sidebar working properly

## Database Schema Updates Required
Run these SQL queries in Supabase SQL editor:
```sql
ALTER TABLE user_profiles DROP COLUMN IF EXISTS full_name;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
```

## Critical Workflow Implementation
- Workspace creation → Site/domain addition within workspace
- No domains can be added without workspace creation first
- Proper modal forms for both workspace and site creation
- Real Supabase database integration working

# System Architecture

## Frontend
- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Tailwind CSS v4, custom design system with dark/light mode
- **UI Components**: Radix UI primitives, custom components via `class-variance-authority`
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: `date-fns`

## Backend
- **Runtime**: Next.js App Router (server-side rendering and API routes)
- **Authentication**: Supabase Auth (client and server-side)
- **Database**: Supabase (PostgreSQL)
- **API Layer**: Next.js API routes with Supabase client integration

## Authentication & Session Management
- Supabase Auth manages user authentication, registration, and sessions.
- Client-side browser client and server-side cookie-based session management are implemented.
- Route protection ensures users are redirected between login and dashboard based on session state.

## Design System
- **CSS Framework**: Tailwind CSS with custom CSS variables for theming.
- **Color System**: HSL-based tokens supporting light and dark themes.
- **Typography**: Inter font family.
- **Responsive Design**: Mobile-first approach with container queries and breakpoints.

## Code Organization
- **File Structure**: Next.js App Router with TypeScript path aliases (`@/*`).
- **Component Structure**: Separation of UI, page, and utility components.
- **Type Safety**: Full TypeScript implementation with strict mode.
- **Styling Architecture**: Component-scoped Tailwind CSS.
- **Authentication Pages**: Centralized authentication logic under `src/app/auth/login/page.tsx` handling both login and signup, with responsive design and URL parameter-based mode switching. Redirects from `src/app/auth/signup/page.tsx`.
- **Service Layer**: Business logic organized into domain-specific services (`workspace.service.ts`, `site.service.ts`, `keyword.service.ts`) and authentication utilities (`middleware.ts`, `session.ts`).
- **Security**: Environment variables for secrets, clear client/server separation, TypeScript for type safety, and authentication middleware for route protection.

# External Dependencies

## Core Infrastructure
- **Supabase**: PostgreSQL database, authentication, real-time capabilities.
- **Next.js**: Full-stack React framework.

## UI & Styling
- **Radix UI**: Accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.

## Development Tools
- **TypeScript**: Type safety.
- **ESLint**: Code linting.
- **React Hook Form + Zod**: Form validation.

## Utility Libraries
- **date-fns**: Date manipulation.
- **clsx & tailwind-merge**: Conditional CSS class management.
- **class-variance-authority**: Type-safe component variant management.