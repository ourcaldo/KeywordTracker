# ⚠️ CRITICAL WARNING - NEVER DELETE ANYTHING FROM THIS FILE ⚠️
# ALL CHANGELOGS MUST BE PRESERVED IN TIMELINE FORMAT
# THIS FILE IS THE MAIN SOURCE OF PROJECT INFORMATION
# ONLY ADD NEW INFORMATION - NEVER REMOVE OR MODIFY EXISTING CONTENT

# Overview

This project is a keyword tracking SEO application built with Next.js and TypeScript. Its primary purpose is to help users monitor and analyze their SEO rankings by tracking keyword performance over time. Key capabilities include a modern web interface, robust authentication, and a dashboard for managing keyword tracking activities. The application aims to provide a comprehensive solution for SEO professionals and businesses to gain insights into their search engine visibility.

# User Preferences

Preferred communication style: Simple, everyday language.

## CRITICAL RULES FOR AGENT BEHAVIOR
- **NEVER DELETE INFORMATION FROM REPLIT.MD** - Only add information, never remove it
- **NO DIRECT SUPABASE ACCESS** - Agent does NOT have direct access to Supabase database. Provide SQL queries for user to run manually
- **MAINTAIN CHANGELOG** - Write all changes with date and detailed information at bottom of replit.md
- **PRESERVE DOCUMENTATION** - Keep all existing information intact when making updates

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
- **Authentication Pages**: Centralized authentication logic handling both login and signup, with responsive design and URL parameter-based mode switching.
- **Service Layer**: Business logic organized into domain-specific services and authentication utilities.
- **Security**: Environment variables for secrets, clear client/server separation, TypeScript for type safety, and authentication middleware for route protection.

## UI/UX Decisions
- WHITE background with glass effects (never dark theme)
- Icon-only sidebar without text labels
- Tesla.com-style dashboard layout with site domain header on top
- Beautiful modal forms instead of ugly prompt() dialogs
- Proper workflow: Create workspace → Add domains within workspace
- Google Analytics-style workspace and domain selector in the dashboard.

## Database Schema (Supabase)

| table_name                       | column_name        | data_type                | is_nullable | column_default         |
| -------------------------------- | ------------------ | ------------------------ | ----------- | ---------------------- |
| tb_keyword_rankings              | id                 | uuid                     | NO          | gen_random_uuid()      |
| tb_keyword_rankings              | keyword_id         | uuid                     | NO          | null                   |
| tb_keyword_rankings              | site_id            | uuid                     | NO          | null                   |
| tb_keyword_rankings              | workspace_id       | uuid                     | NO          | null                   |
| tb_keyword_rankings              | user_id            | uuid                     | NO          | null                   |
| tb_keyword_rankings              | position           | integer                  | YES         | null                   |
| tb_keyword_rankings              | device             | USER-DEFINED             | NO          | 'desktop'::device_type |
| tb_keyword_rankings              | location           | text                     | NO          | 'US'::text             |
| tb_keyword_rankings              | recorded_at        | timestamp with time zone | NO          | null                   |
| tb_keyword_rankings              | created_at         | timestamp with time zone | NO          | now()                  |
| tb_keywords                      | id                 | uuid                     | NO          | gen_random_uuid()      |
| tb_keywords                      | site_id            | uuid                     | NO          | null                   |
| tb_keywords                      | workspace_id       | uuid                     | NO          | null                   |
| tb_keywords                      | user_id            | uuid                     | NO          | null                   |
| tb_keywords                      | keyword            | text                     | NO          | null                   |
| tb_keywords                      | target_url         | text                     | YES         | null                   |
| tb_keywords                      | volume             | integer                  | YES         | null                   |
| tb_keywords                      | created_at         | timestamp with time zone | NO          | now()                  |
| tb_keywords                      | updated_at         | timestamp with time zone | NO          | now()                  |
| tb_keywords_with_latest_rankings | id                 | uuid                     | YES         | null                   |
| tb_keywords_with_latest_rankings | site_id            | uuid                     | YES         | null                   |
| tb_keywords_with_latest_rankings | workspace_id       | uuid                     | YES         | null                   |
| tb_keywords_with_latest_rankings | user_id            | uuid                     | YES         | null                   |
| tb_keywords_with_latest_rankings | keyword            | text                     | YES         | null                   |
| tb_keywords_with_latest_rankings | target_url         | text                     | YES         | null                   |
| tb_keywords_with_latest_rankings | volume             | integer                  | YES         | null                   |
| tb_keywords_with_latest_rankings | created_at         | timestamp with time zone | YES         | null                   |
| tb_keywords_with_latest_rankings | updated_at         | timestamp with time zone | YES         | null                   |
| tb_keywords_with_latest_rankings | latest_position    | integer                  | YES         | null                   |
| tb_keywords_with_latest_rankings | latest_device      | USER-DEFINED             | YES         | null                   |
| tb_keywords_with_latest_rankings | latest_location    | text                     | YES         | null                   |
| tb_keywords_with_latest_rankings | latest_recorded_at | timestamp with time zone | YES         | null                   |
| tb_sites                         | id                 | uuid                     | NO          | gen_random_uuid()      |
| tb_sites                         | workspace_id       | uuid                     | NO          | null                   |
| tb_sites                         | user_id            | uuid                     | NO          | null                   |
| tb_sites                         | domain             | text                     | NO          | null                   |
| tb_sites                         | name               | text                     | NO          | null                   |
| tb_sites                         | created_at         | timestamp with time zone | NO          | now()                  |
| tb_sites                         | updated_at         | timestamp with time zone | NO          | now()                  |
| tb_user_profiles                 | id                 | uuid                     | NO          | gen_random_uuid()      |
| tb_user_profiles                 | user_id            | uuid                     | NO          | null                   |
| tb_user_profiles                 | avatar_url         | text                     | YES         | null                   |
| tb_user_profiles                 | plan               | USER-DEFINED             | NO          | 'free'::user_plan      |
| tb_user_profiles                 | created_at         | timestamp with time zone | NO          | now()                  |
| tb_user_profiles                 | updated_at         | timestamp with time zone | NO          | now()                  |
| tb_user_profiles                 | phone_number       | text                     | YES         | null                   |
| tb_user_profiles                 | email              | text                     | YES         | null                   |
| tb_user_profiles                 | first_name         | text                     | YES         | null                   |
| tb_user_profiles                 | last_name          | text                     | YES         | null                   |
| tb_workspace_stats               | id                 | uuid                     | YES         | null                   |
| tb_workspace_stats               | name               | text                     | YES         | null                   |
| tb_workspace_stats               | user_id            | uuid                     | YES         | null                   |
| tb_workspace_stats               | sites_count        | bigint                   | YES         | null                   |
| tb_workspace_stats               | keywords_count     | bigint                   | YES         | null                   |
| tb_workspace_stats               | rankings_count     | bigint                   | YES         | null                   |
| tb_workspaces                    | id                 | uuid                     | NO          | gen_random_uuid()      |
| tb_workspaces                    | user_id            | uuid                     | NO          | null                   |
| tb_workspaces                    | name               | text                     | NO          | null                   |
| tb_workspaces                    | description        | text                     | YES         | null                   |
| tb_workspaces                    | created_at         | timestamp with time zone | NO          | now()                  |
| tb_workspaces                    | updated_at         | timestamp with time zone | NO          | now()                  |
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

# Changelog

## 2025-08-04 - Database Table Restructuring with "tb" Prefix and Collections
- **Table Renaming**: Implemented systematic "tb" prefix for all database tables
- **Collection Organization**: Grouped tables into logical collections:
  - **User Collection**: tb_user_profiles
  - **Workspace Collection**: tb_workspaces  
  - **Sites Collection**: tb_sites
  - **Keywords Collection**: tb_keywords, tb_keyword_rankings, tb_keywords_with_latest_rankings
- **Code Updates**: Updated all TypeScript types, API routes, and service layer queries
- **Migration Script**: Created comprehensive SQL migration script in migrations/01_rename_tables_with_prefix.sql
- **View Recreation**: Updated tb_keywords_with_latest_rankings view with new table names
- **API Alignment**: Modified all API endpoints to use new table names and relationships
- **Status**: Database schema restructured with consistent naming convention ready for deployment
- **SQL Migration**: Created corrected migration script in migrations/01_rename_tables_with_prefix_corrected.sql
- **API Alignment**: Modified all API endpoints to use new table names and relationships  
- **Code Updates**: Updated all TypeScript types, API routes, and service layer queries to use tb_ prefix