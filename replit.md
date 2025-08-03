# Overview

This is a keyword tracking SEO application built with Next.js 15 and TypeScript. The application helps users monitor their SEO rankings by tracking keywords and their performance over time. It features a modern web interface with authentication capabilities and a dashboard for managing keyword tracking activities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: Next.js 15 with React 19 using the App Router architecture
- **Styling**: Tailwind CSS v4 with a custom design system including dark/light mode support
- **UI Components**: Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, forms, etc.)
- **Component Library**: Custom UI components built on top of Radix with consistent styling using class-variance-authority
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns library for date manipulation and formatting

## Backend Architecture
- **Runtime**: Server-side rendering and API routes through Next.js App Router
- **Authentication**: Supabase Auth with both client-side and server-side implementations
- **Database**: Supabase (PostgreSQL) for data persistence
- **API Layer**: Next.js API routes with server-side Supabase client integration

## Authentication & Session Management
- **Provider**: Supabase Auth handles user authentication, registration, and session management
- **Client Setup**: Browser client for client-side operations with automatic session handling
- **Server Setup**: Server client with cookie-based session management for server-side operations
- **Route Protection**: Authentication checks redirect users between login and dashboard based on session state

## Design System
- **CSS Framework**: Tailwind CSS with custom CSS variables for theming
- **Color System**: HSL-based color tokens supporting both light and dark themes
- **Typography**: Inter font family for consistent text rendering
- **Responsive Design**: Mobile-first approach with container queries and responsive breakpoints

## Code Organization
- **File Structure**: Next.js App Router with TypeScript path mapping (@/* aliases)
- **Component Structure**: Separation of UI components, page components, and utility functions
- **Type Safety**: Full TypeScript implementation with strict mode enabled
- **Styling Architecture**: Component-scoped styles using Tailwind with utility-first approach

# External Dependencies

## Core Infrastructure
- **Supabase**: Primary backend service providing PostgreSQL database, authentication, and real-time capabilities
- **Next.js**: Full-stack React framework for both frontend and backend functionality

## UI & Styling
- **Radix UI**: Accessible component primitives for dialogs, forms, navigation, and interactive elements
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent visual elements

## Development Tools
- **TypeScript**: Type safety and developer experience enhancement
- **ESLint**: Code linting with Next.js specific configurations
- **React Hook Form + Zod**: Form validation and type-safe form handling

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: Conditional CSS class management
- **class-variance-authority**: Type-safe component variant management

## Authentication Flow
The application uses Supabase's authentication system with email/password login, automatic session management, and protected routes that redirect based on authentication state.

## Code Organization & Architecture

### Component Structure
- **Authentication Components** (`src/components/auth/`): Centralized auth UI components
  - `AuthLayout`: Responsive layout with branding for auth pages
  - `LoginForm`: Complete login/signup form with validation and error handling
- **UI Components** (`src/components/ui/`): Reusable Radix-based components with consistent styling
- **Dashboard Components** (`src/components/`): Application-specific UI components

### Service Layer Architecture
- **API Client** (`src/lib/api/client.ts`): Centralized HTTP client with error handling
- **Business Services** (`src/lib/services/`): Domain-specific business logic
  - `workspace.service.ts`: Workspace management operations
  - `site.service.ts`: Site management within workspaces
  - `keyword.service.ts`: Keyword and ranking data operations
- **Authentication Services** (`src/lib/auth/`): Auth utilities and session management
  - `middleware.ts`: Route protection and auth checks
  - `session.ts`: Client/server session utilities

### Type Safety & Database
- **Database Types** (`src/types/database.ts`): Complete TypeScript definitions for all tables
- **Constants** (`src/lib/utils/constants.ts`): Application-wide configuration and enums

### Security Implementation
- **Environment Variables**: All secrets properly externalized to `.env` files
- **Client/Server Separation**: Clear separation between client and server-side operations
- **Type Safety**: Full TypeScript coverage with strict mode enabled
- **Authentication Middleware**: Proper route protection and session validation

## Recent Changes (January 2025)

### ✅ Migration & Security Improvements
- **Professional Login Design**: Completely redesigned authentication pages with modern, branded UI
- **Code Organization**: Restructured codebase into logical modules with proper separation of concerns
- **Security Hardening**: Implemented proper client/server separation and externalized all secrets
- **Type Safety**: Added comprehensive TypeScript definitions for all database operations
- **Service Architecture**: Created centralized business logic services with consistent error handling
- **Documentation**: Added comprehensive inline documentation for all components and utilities

### ✅ Modern Authentication UI (Latest)
- **Elegant Design**: Beautiful modern login/signup page inspired by top SaaS platforms (Sellora, Felix UI style)
- **Enhanced Signup**: Added full name and phone number fields with proper Supabase integration
- **User Profile Management**: Extended user_profiles table with full_name, phone_number, email columns
- **Mobile Responsive**: Clean two-column layout that adapts perfectly to mobile devices
- **Visual Polish**: Gradient backgrounds, modern shadows, smooth animations, proper form validation
- **Display Name Logic**: First name extracted from full name for Supabase auth display_name

### ✅ Authentication System
- **Enhanced UI**: Professional login page with responsive design and branding
- **Session Management**: Robust client/server session utilities
- **Route Protection**: Middleware-based authentication checks
- **Error Handling**: Comprehensive error states and user feedback
- **Extended Signup**: Full name, phone number collection with database integration

### ✅ Developer Experience
- **Code Documentation**: Every file includes purpose, functionality, and usage documentation
- **Type Definitions**: Complete database schema types for development safety
- **Service Layer**: Organized business logic into reusable, testable services
- **API Standards**: Consistent API client with standardized error handling
- **Database Schema**: Enhanced user_profiles table structure with proper RLS policies

## Changelog

### 2025-01-03 - Migration & Security Enhancement
- ✅ Migrated from Replit Agent to standard Replit environment
- ✅ Installed all required Node.js packages and dependencies
- ✅ Redesigned authentication pages with professional, branded UI
- ✅ Reorganized codebase into logical modules with proper documentation
- ✅ Implemented comprehensive service layer architecture
- ✅ Added complete TypeScript type definitions for database operations
- ✅ Enhanced security with proper environment variable handling
- ✅ Created reusable UI components with consistent styling
- ✅ Established authentication middleware and session management
- ✅ Added comprehensive inline documentation throughout codebase
- ✅ Modern elegant login/signup UI inspired by top SaaS platforms
- ✅ Enhanced signup with full name and phone number collection
- ✅ Extended user_profiles database schema with proper RLS policies
- ✅ Mobile-responsive design with gradient backgrounds and modern styling