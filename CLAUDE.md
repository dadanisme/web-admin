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
- **Backend**: Firebase (Firestore + Auth + Cloud Functions)
- **Authentication**: Firebase Auth with Google Sign-In only
- **Configuration**: Environment variables for Firebase config

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run admin-claims` - Manage Firebase admin claims (see Admin Scripts section)

### Firebase Functions Commands

- `cd functions && npm run build` - Build Firebase functions
- `cd functions && npm run serve` - Start local Firebase emulator
- `cd functions && npm run deploy` - Deploy functions to Firebase
- `cd functions && npm run logs` - View function logs

## Project Structure

```
src/
├── app/                 # App Router directory
│   ├── globals.css     # Global styles and CSS variables
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
└── lib/
    └── utils.ts        # Utility functions (cn helper)

functions/
├── src/
│   ├── index.ts        # Functions entry point
│   ├── config/
│   │   └── firebase.ts # Firebase Admin initialization
│   ├── exams/
│   │   ├── writeExamPendingReview.ts    # Exam statistics updates
│   │   └── writeSubjectPendingReview.ts # Subject statistics updates
│   ├── helpers/
│   │   └── registration-sync.ts # Database operation helpers
│   └── users/
│       ├── helpers.ts          # User-specific helpers
│       └── onUserSchoolUpdate.ts # User update triggers
├── package.json        # Functions dependencies
└── tsconfig.json      # Functions TypeScript config
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
- **IMPORTANT: Always use semantic color classes, never hardcode colors**
  - Use `primary`, `secondary`, `destructive`, `muted`, `accent` instead of hardcoded colors
  - Use `text-primary`, `bg-primary`, `border-primary` etc.
  - Use `text-muted-foreground`, `text-destructive`, `bg-secondary` for semantic meanings
  - Avoid classes like `text-red-500`, `bg-blue-600` - use semantic equivalents

## Development Notes

- Turbopack is enabled for faster development builds
- ESLint is configured with Next.js rules
- PostCSS is configured for Tailwind CSS processing
- The project uses the latest React 19 with concurrent features

## Environment Configuration

### Setup

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase project configuration values
3. All Firebase config is loaded from environment variables

### Required Environment Variables

#### Firebase Client SDK (Web App)

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Firebase Admin SDK (Server-side Operations)

```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Security Notes

- Environment files (`.env*`) are gitignored for security
- Firebase configuration includes validation to ensure all required variables are present
- Use `NEXT_PUBLIC_` prefix for client-side accessible variables

## Admin Scripts

### Custom Claims Management

A TypeScript script is provided to manage admin custom claims for users:

```bash
# Direct usage with npx ts-node
npx ts-node --project tsconfig.scripts.json scripts/manage-admin-claims.ts set user@example.com school123
npx ts-node --project tsconfig.scripts.json scripts/manage-admin-claims.ts remove user@example.com
npx ts-node --project tsconfig.scripts.json scripts/manage-admin-claims.ts get user@example.com

# Or using npm script (recommended - shorter and consistent)
npm run admin-claims set user@example.com school123
npm run admin-claims remove user@example.com
npm run admin-claims get user@example.com
```

### Script Setup

1. **Get Firebase Service Account Key:**
   - Go to Firebase Console > Project Settings > Service Accounts
   - Generate new private key
   - Download the JSON file

2. **Configure Environment Variables:**
   - Extract `project_id`, `client_email`, and `private_key` from JSON
   - Add to `.env.local` file:
     ```
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
     ```

3. **Scripts Location:**
   - Scripts are stored in `/scripts` folder
   - This folder is gitignored for security
   - Contains admin utilities and setup scripts

4. **TypeScript Configuration:**
   - Scripts use `tsconfig.scripts.json` for proper TypeScript compilation
   - Uses CommonJS modules for compatibility with ts-node
   - No `any` types allowed - full type safety enforced

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
  - activeBatchId: string (references active batch)
  - students/{studentId}
    - name: string
    - batchId: string (must match school's activeBatchId for active students)
    - photoURL?: string
  - subjects/{subjectId}
    - name: string
    - pendingReview: number (from oldest ungraded exam)
    - totalStudentsPassed: number (from oldest ungraded exam)
    - totalStudentsFailed: number (from oldest ungraded exam)
    - targetExamId: string (ID of oldest ungraded exam)
    - exams/{examId}
      - name: string
      - maxScore?: number
      - passingScore?: number
      - pendingReview: number (students not yet graded)
      - isDone: boolean (all students graded)
      - totalStudentsPassed: number (students >= passingScore)
      - totalStudentsFailed: number (students < passingScore)
      - examResults/{examResultId}
        - studentId: string
        - score: number
        - comment?: string

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
3. When invited user logs into iOS app, auto-assign to school (handled by Cloud Function)

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
- **Auto-School Assignment**: Cloud Function automatically syncs schoolId to registrations when users login

## Firebase Cloud Functions

### onUserUpdated Function

**Purpose**: Automatically syncs schoolId from user documents to their registrations when a user is assigned to a school.

**Trigger**: `onDocumentUpdated("users/{userId}")`

**Behavior**:

- Listens for changes to user documents
- Detects when `schoolId` field is added or modified
- Finds all registrations for that user
- Updates all registrations with the new `schoolId`
- Logs the sync operation for monitoring

**Use Case**: When a teacher logs into the iOS app after being invited, their user document gets updated with a `schoolId`. This function ensures their existing registration records are automatically updated to reflect the school assignment.

**Structure**:

- Main function: `syncUserSchoolToRegistrations()` - Contains business logic
- Trigger function: `onUserUpdated()` - Firebase trigger wrapper
- Helper functions: Database query and batch update operations

**Location**: `functions/src/users/onUserSchoolUpdate.ts`

### writeExamPendingReview Function

**Purpose**: Automatically updates exam statistics when exam results are added or modified.

**Trigger**: `onDocumentWritten("schools/{schoolId}/subjects/{subjectId}/exams/{examId}/examResults/{examResultId}")`

**Behavior**:

- Counts total students in the school's active batch (filtered by `activeBatchId`)
- Counts graded exam results (results with scores > 0)
- Calculates pass/fail statistics based on exam's `passingScore`
- Updates exam document with: `pendingReview`, `isDone`, `totalStudentsPassed`, `totalStudentsFailed`
- Uses efficient `.count()` queries for optimal performance

**Location**: `functions/src/exams/writeExamPendingReview.ts`

### writeSubjectPendingReview Function

**Purpose**: Automatically updates subject statistics based on the oldest ungraded exam.

**Trigger**: `onDocumentWritten("schools/{schoolId}/subjects/{subjectId}/exams/{examId}")`

**Behavior**:

- Finds the oldest ungraded exam (where `isDone == false`, ordered by `createdAt`)
- Copies statistics from that exam to the subject document
- Updates subject with: `pendingReview`, `totalStudentsPassed`, `totalStudentsFailed`, `targetExamId`
- Prioritizes exams that need attention first

**Location**: `functions/src/exams/writeSubjectPendingReview.ts`
