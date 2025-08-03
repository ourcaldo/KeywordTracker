# IMPORTANT: DATABASE & SECRETS

This project uses Supabase for database and authentication. **NEVER ASK FOR DATABASE_URL OR ANY SECRETS**. All secrets are loaded from .env.example that is copied as .env. If database updates are needed, provide SQL queries in the conversation - you do not have direct access to Supabase.

# Overview

This project is a keyword tracking SEO application built with Next.js and TypeScript. Its primary purpose is to help users monitor and analyze their SEO rankings by tracking keyword performance over time. Key capabilities include a modern web interface, robust authentication, and a dashboard for managing keyword tracking activities. The application aims to provide a comprehensive solution for SEO professionals and businesses to gain insights into their search engine visibility.

## Database Schema (Supabase)

### Core Tables
- `user_profiles` - User information with first_name, last_name, email, phone_number, plan
- `workspaces` - User workspaces for organizing SEO projects  
- `sites` - Domain sites within workspaces
- `keywords` - Keywords to track for each site
- `keyword_rankings` - Historical ranking data for keywords

### Key Relationships
- Users → Workspaces (1:many)
- Workspaces → Sites (1:many) 
- Sites → Keywords (1:many)
- Keywords → Rankings (1:many)

### Critical Workflow
1. User must create workspace first
2. Then add domain sites within workspace
3. Then add keywords to track for each site

| table_name                    | column_name        | data_type                | is_nullable | column_default         |
| ----------------------------- | ------------------ | ------------------------ | ----------- | ---------------------- |
| keyword_rankings              | id                 | uuid                     | NO          | gen_random_uuid()      |
| keyword_rankings              | keyword_id         | uuid                     | NO          | null                   |
| keyword_rankings              | site_id            | uuid                     | NO          | null                   |
| keyword_rankings              | workspace_id       | uuid                     | NO          | null                   |
| keyword_rankings              | user_id            | uuid                     | NO          | null                   |
| keyword_rankings              | position           | integer                  | YES         | null                   |
| keyword_rankings              | device             | USER-DEFINED             | NO          | 'desktop'::device_type |
| keyword_rankings              | location           | text                     | NO          | 'US'::text             |
| keyword_rankings              | recorded_at        | timestamp with time zone | NO          | null                   |
| keyword_rankings              | created_at         | timestamp with time zone | NO          | now()                  |
| keywords                      | id                 | uuid                     | NO          | gen_random_uuid()      |
| keywords                      | site_id            | uuid                     | NO          | null                   |
| keywords                      | workspace_id       | uuid                     | NO          | null                   |
| keywords                      | user_id            | uuid                     | NO          | null                   |
| keywords                      | keyword            | text                     | NO          | null                   |
| keywords                      | target_url         | text                     | YES         | null                   |
| keywords                      | volume             | integer                  | YES         | null                   |
| keywords                      | created_at         | timestamp with time zone | NO          | now()                  |
| keywords                      | updated_at         | timestamp with time zone | NO          | now()                  |
| keywords_with_latest_rankings | id                 | uuid                     | YES         | null                   |
| keywords_with_latest_rankings | site_id            | uuid                     | YES         | null                   |
| keywords_with_latest_rankings | workspace_id       | uuid                     | YES         | null                   |
| keywords_with_latest_rankings | user_id            | uuid                     | YES         | null                   |
| keywords_with_latest_rankings | keyword            | text                     | YES         | null                   |
| keywords_with_latest_rankings | target_url         | text                     | YES         | null                   |
| keywords_with_latest_rankings | volume             | integer                  | YES         | null                   |
| keywords_with_latest_rankings | created_at         | timestamp with time zone | YES         | null                   |
| keywords_with_latest_rankings | updated_at         | timestamp with time zone | YES         | null                   |
| keywords_with_latest_rankings | latest_position    | integer                  | YES         | null                   |
| keywords_with_latest_rankings | latest_device      | USER-DEFINED             | YES         | null                   |
| keywords_with_latest_rankings | latest_location    | text                     | YES         | null                   |
| keywords_with_latest_rankings | latest_recorded_at | timestamp with time zone | YES         | null                   |
| sites                         | id                 | uuid                     | NO          | gen_random_uuid()      |
| sites                         | workspace_id       | uuid                     | NO          | null                   |
| sites                         | user_id            | uuid                     | NO          | null                   |
| sites                         | domain             | text                     | NO          | null                   |
| sites                         | name               | text                     | NO          | null                   |
| sites                         | location           | text                     | NO          | 'US'::text             |
| sites                         | created_at         | timestamp with time zone | NO          | now()                  |
| sites                         | updated_at         | timestamp with time zone | NO          | now()                  |
| user_profiles                 | id                 | uuid                     | NO          | gen_random_uuid()      |
| user_profiles                 | user_id            | uuid                     | NO          | null                   |
| user_profiles                 | avatar_url         | text                     | YES         | null                   |
| user_profiles                 | plan               | USER-DEFINED             | NO          | 'free'::user_plan      |
| user_profiles                 | created_at         | timestamp with time zone | NO          | now()                  |
| user_profiles                 | updated_at         | timestamp with time zone | NO          | now()                  |
| user_profiles                 | phone_number       | text                     | YES         | null                   |
| user_profiles                 | email              | text                     | YES         | null                   |
| user_profiles                 | first_name         | text                     | YES         | null                   |
| user_profiles                 | last_name          | text                     | YES         | null                   |
| workspace_stats               | id                 | uuid                     | YES         | null                   |
| workspace_stats               | name               | text                     | YES         | null                   |
| workspace_stats               | user_id            | uuid                     | YES         | null                   |
| workspace_stats               | sites_count        | bigint                   | YES         | null                   |
| workspace_stats               | keywords_count     | bigint                   | YES         | null                   |
| workspace_stats               | rankings_count     | bigint                   | YES         | null                   |
| workspaces                    | id                 | uuid                     | NO          | gen_random_uuid()      |
| workspaces                    | user_id            | uuid                     | NO          | null                   |
| workspaces                    | name               | text                     | NO          | null                   |
| workspaces                    | description        | text                     | YES         | null                   |
| workspaces                    | created_at         | timestamp with time zone | NO          | now()                  |
| workspaces                    | updated_at         | timestamp with time zone | NO          | now()                  |

# User Preferences

Preferred communication style: Simple, everyday language.

## CRITICAL RULES FOR AGENT BEHAVIOR
- **NEVER DELETE INFORMATION FROM REPLIT.MD** - Only add information, never remove it
- **NO DIRECT SUPABASE ACCESS** - Agent does NOT have direct access to Supabase database. Provide SQL queries for user to run manually
- **MAINTAIN CHANGELOG** - Write all changes with date and detailed information at bottom of replit.md
- **PRESERVE DOCUMENTATION** - Keep all existing information intact when making updates

## Design Requirements
- WHITE background with glass effects (never dark theme)
- Icon-only sidebar without text labels
- Tesla.com-style dashboard layout with site domain header on top
- Beautiful modal forms instead of ugly prompt() dialogs
- Proper workflow: Create workspace → Add domains within workspace

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

---

# CHANGELOG

## 2025-08-03 - Project Migration from Replit Agent to Replit Environment
- **Migration Completed**: Successfully migrated Next.js SEO keyword tracking application to standard Replit environment
- **Package Installation**: Installed all required Node.js dependencies including Next.js 15, React 19, Supabase client, Radix UI components, Tailwind CSS, and TypeScript
- **Environment Setup**: Verified Supabase environment variables are properly configured (.env file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
- **Server Status**: Next.js development server successfully running on port 5000
- **Security Practices**: Maintained proper client/server separation, TypeScript type safety, and environment variable management
- **Database Access**: Confirmed agent has NO direct database access - all SQL queries must be provided to user for manual execution
- **Documentation Updates**: Added critical rules for agent behavior to prevent unauthorized changes and maintain documentation integrity