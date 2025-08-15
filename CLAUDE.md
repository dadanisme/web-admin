# Web Admin Project Guidelines

## Project Overview

This is a Next.js 15 app router project for school administration dashboard. It manages teacher registration approvals for iOS app users, using shadcn/ui components with the "new-york" style variant.

### Business Logic

- **Teachers** use iOS app → first login shows registration link → share with admin
- **Admins** receive link → open web dashboard → view teacher data → approve/reject
- **After approval** → teacher gets full iOS app access with school assignment

## Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Runtime**: React 19.1.0
- **UI Components**: shadcn/ui (new-york style)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Icons**: Lucide React
- **TypeScript**: Yes (strict mode enabled)
- **Development**: Turbopack for faster builds
- **Backend**: Firebase (Firestore + Auth)
- **Authentication**: Firebase Auth with Google Sign-In only

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                 # App Router directory
│   ├── globals.css     # Global styles and CSS variables
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
└── lib/
    └── utils.ts        # Utility functions (cn helper)
```

## shadcn/ui Configuration

- **Style**: new-york
- **Base Color**: neutral
- **RSC**: Enabled (React Server Components)
- **CSS Variables**: Enabled
- **Icon Library**: lucide-react

## Path Aliases

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/utils` → `src/lib/utils`
- `@/ui` → `src/components/ui`
- `@/hooks` → `src/hooks`

## Code Conventions

- Use TypeScript for all files with strict mode
- Follow shadcn/ui component patterns and new-york style
- Use the `cn()` utility function for conditional class names
- Prefer Server Components when possible
- Use proper file-based routing with app directory
- Use Lucide React for icons

## Component Guidelines

- Components should follow shadcn/ui patterns
- Use TypeScript interfaces for all props
- Implement proper error boundaries where needed
- Use CSS variables for theming (defined in globals.css)

## Styling Guidelines

- Use Tailwind CSS v4 utility classes
- Follow shadcn/ui design system with neutral base color
- CSS variables are enabled for theme customization
- Global styles are in `src/app/globals.css`

## Development Notes

- Turbopack is enabled for faster development builds
- ESLint is configured with Next.js rules
- PostCSS is configured for Tailwind CSS processing
- The project uses the latest React 19 with concurrent features

## Authentication & Authorization

### Admin Access Requirements

- **Authentication Method**: Firebase Auth with Google Sign-In only
- **Required Custom Claims**:
  - `admin: true` - Identifies user as administrator
  - `schoolId: string` - Restricts admin to specific school
- **Access Control**: Dashboard only accessible with proper custom claims
- **Scope**: Admin can only manage their assigned school

### Regular Users

- **Claims**: No custom claims (handled by iOS app)
- **Access**: Cannot access web dashboard

## Data Structure

### Firestore Collections

```
schools/{schoolId}/
  - (future nested collections)

users/{userId}
  - schoolId: string | null (initially null)
  - (other user data)

registrations/{registrationId}
  - userId: string
  - userEmail: string
  - status: "pending" | "approved" | "rejected"
  - createdAt: timestamp
```

### Custom Claims Example

```typescript
{
  admin: true,
  schoolId: "school_abc_123"
}
```

## Business Rules

### Teacher Registration Flow

1. Teacher shares registration link with registrationId parameter
2. Link opens dashboard showing teacher's pending registration
3. Admin can approve/reject registration
4. Approval assigns schoolId to user document
5. Registration status updated to "approved"

### Teacher Invitation Flow

1. Admin invites teacher by email address
2. If email not in users collection, create registration entry
3. When invited user logs into iOS app, auto-assign to school

### Data Access Rules

- Admin can only view/manage registrations for their schoolId
- One user can only belong to one school (schoolId field)
- Registration approval assigns user to admin's school
- Rejected registrations remain in database with status "rejected"

## Route Structure

```
/                     # Dashboard home (requires admin auth)
/register/[id]        # Registration approval page
/invite              # Teacher invitation page
/login               # Authentication page
/forbidden            # Access forbidden page (authenticated but not admin)
```

### Route Constants

All routes are defined in `src/lib/paths.ts` as the `ROUTES` constant to avoid hardcoded paths throughout the application. For backward compatibility, they are also exported from `src/lib/constants.ts`.

## Key Features

- **Registration Management**: View and approve/reject teacher registrations
- **Teacher Invitation**: Invite teachers by email address
- **Authentication Guard**: Verify admin claims on protected routes
- **School-Scoped Access**: Only show data for admin's assigned school
