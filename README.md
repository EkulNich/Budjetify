# Budgetify 🐷

A React Native mobile app that helps users build better spending habits by tracking expenses, setting spending limits, and translating money into hours of work.

---

## Features

**Spending Limits** — Set how much you want to spend for an event or over a time frame (daily, weekly, monthly) and track whether you stick to it.

**Expense Tracker** — Log and review your expenses over time to understand your spending patterns.

**Hours of Work** — Before adding an expense, see how many hours of work it costs you based on your salary. Helps you decide if it's really worth it.

**Accountability** _(coming soon)_ — Share your progress with friends or family, send congrats for streaks, and keep each other in check.

---

## Tech Stack

- **Frontend** — React Native (Expo), Expo Router, TypeScript
- **Backend** — Supabase (Postgres, Auth, Row Level Security)
- **Authentication** — Google Sign-In via `@react-native-google-signin/google-signin` + Supabase Auth

---

## Getting Started

### Prerequisites

- Node.js
- Expo CLI
- A Supabase project with Google Auth enabled

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

### Run the app

```bash
npx expo start
```

---

## Database Schema

Three core tables in Supabase, all with Row Level Security enabled:

**profiles** — one row per user, stores `username`, `monthly_salary`, `monthly_budget`. Primary key `id` links to `auth.users.id`.

**expenses** — individual expense records with `amount`, `description`, and optional `category`. Linked to `profiles` via `user_id`.

**spending_limits** — per-category budget caps with `limit_amount` and `period` (daily / weekly / monthly / event).

RLS policies enforce `auth.uid() = user_id` on all tables — users can only read and write their own data.

---

## Authentication Flow

1. User taps Sign in with Google
2. Native Google OAuth screen appears
3. Google issues an ID token
4. App calls `supabase.auth.signInWithIdToken` with the token
5. Supabase validates the token and returns a session
6. A profile row is created for new users
7. App navigates to the home screen

Session tokens are persisted on device via `AsyncStorage` and auto-refreshed before expiry.

---

## Building the APK

```bash
eas build --platform android --profile preview
```

Requires an [Expo](https://expo.dev) account and EAS CLI installed (`npm install -g eas-cli`).

---

## Team

Built by Luke and Shreejith as part of Orbital 2026.
