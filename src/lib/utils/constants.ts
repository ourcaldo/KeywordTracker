/**
 * Application Constants
 * 
 * Centralized constants used throughout the application.
 * Includes configuration values, enums, and default settings.
 */

/**
 * User plan limits and features
 */
export const PLAN_LIMITS = {
  free: {
    workspaces: 1,
    sites: 2,
    keywords: 10,
    dailyChecks: 1,
  },
  basic: {
    workspaces: 3,
    sites: 10,
    keywords: 100,
    dailyChecks: 1,
  },
  pro: {
    workspaces: 10,
    sites: 50,
    keywords: 1000,
    dailyChecks: 3,
  },
  enterprise: {
    workspaces: -1, // Unlimited
    sites: -1,      // Unlimited
    keywords: -1,   // Unlimited
    dailyChecks: 24, // Hourly
  },
} as const

/**
 * Position range filters for the dashboard
 */
export const POSITION_RANGES = [
  { label: 'Top 3', value: 'top-3', min: 1, max: 3 },
  { label: 'Top 5', value: 'top-5', min: 1, max: 5 },
  { label: 'Top 10', value: 'top-10', min: 1, max: 10 },
  { label: 'Top 20', value: 'top-20', min: 1, max: 20 },
  { label: 'Top 50', value: 'top-50', min: 1, max: 50 },
  { label: 'Top 100', value: 'top-100', min: 1, max: 100 },
] as const

/**
 * Supported search engine locations
 */
export const SEARCH_LOCATIONS = [
  { label: 'United States', value: 'US', code: 'us' },
  { label: 'United Kingdom', value: 'UK', code: 'gb' },
  { label: 'Canada', value: 'CA', code: 'ca' },
  { label: 'Australia', value: 'AU', code: 'au' },
  { label: 'Germany', value: 'DE', code: 'de' },
  { label: 'France', value: 'FR', code: 'fr' },
  { label: 'Spain', value: 'ES', code: 'es' },
  { label: 'Italy', value: 'IT', code: 'it' },
  { label: 'Netherlands', value: 'NL', code: 'nl' },
  { label: 'Brazil', value: 'BR', code: 'br' },
] as const

/**
 * Device types for ranking checks
 */
export const DEVICE_TYPES = [
  { label: 'Desktop', value: 'desktop' as const },
  { label: 'Mobile', value: 'mobile' as const },
] as const

/**
 * Date range presets for analytics
 */
export const DATE_RANGES = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last 6 months', days: 180 },
  { label: 'Last year', days: 365 },
] as const

/**
 * Navigation menu items
 */
export const NAVIGATION_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    name: 'Keyword Tracker',
    href: '/keyword-tracker', 
    icon: 'Search',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'Settings',
    position: 'bottom',
  },
] as const

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signOut: '/auth/sign-out',
  },
  workspaces: '/workspaces',
  sites: '/sites',
  keywords: '/keywords',
  rankings: '/rankings',
} as const