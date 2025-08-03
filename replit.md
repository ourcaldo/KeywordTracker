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