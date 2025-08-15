# School Admin Dashboard

A Next.js 15 web application for managing teacher registrations and school assignments. This dashboard works in conjunction with an iOS app, allowing administrators to approve teacher registrations and invite new teachers to their schools.

## 🎯 Overview

### Business Flow

1. **Teachers** use the iOS app → first login shows registration link → share with admin
2. **Admins** receive link → open web dashboard → view teacher data → approve/reject
3. **After approval** → teacher gets full iOS app access with school assignment
4. **Alternatively** → admins can proactively invite teachers by email

## 🚀 Features

### ✅ Implemented Features

- **Authentication & Authorization**
  - Firebase Auth with Google Sign-In only
  - Custom claims-based admin access (`admin: true`, `schoolId: string`)
  - Route protection for admin-only pages

- **Teacher Registration Management**
  - Registration approval workflow via shareable links
  - Real-time registration status updates
  - Detailed teacher information display
  - Approve/reject functionality with audit trail

- **Teacher Invitation System**
  - Invite teachers by email address
  - Auto-assignment to admin's school
  - Duplicate prevention and validation
  - Support for existing and new users

- **Dashboard Analytics**
  - Real-time statistics with skeleton loading
  - Active teacher count per school
  - Pending invitation tracking
  - School-scoped data access

- **Modern UI/UX**
  - shadcn/ui components with "new-york" style
  - Responsive design for desktop and mobile
  - Loading states and error handling
  - Semantic color system

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Runtime**: React 19.1.0
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with CSS variables
- **UI Components**: shadcn/ui (new-york style)
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore + Auth)
- **Development**: Turbopack for faster builds

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Firebase service account key for admin operations

### Setup Steps

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd web-admin
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Firebase configuration in `.env.local`:
   ```env
   # Firebase Client SDK (Web App)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Firebase Admin SDK (Server-side Operations)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

3. **Firebase Setup**
   - Enable Google Authentication in Firebase Console
   - Set up Firestore with appropriate security rules
   - Download service account key for admin operations

4. **Development**
   ```bash
   npm run dev
   ```

## 🧑‍💼 Admin User Setup

To create admin users with proper custom claims:

```bash
# Set admin claims for a user
npm run admin-claims set user@example.com school123

# Remove admin claims
npm run admin-claims remove user@example.com

# Check user claims
npm run admin-claims get user@example.com
```

## 📁 Project Structure

```
src/
├── app/                     # App Router pages
│   ├── globals.css         # Global styles and CSS variables
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Dashboard home
│   ├── invite/             # Teacher invitation page
│   ├── login/              # Authentication page
│   ├── register/[id]/      # Registration approval page
│   └── forbidden/          # Access denied page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── auth-guard.tsx      # Route protection component
│   └── registration-success.tsx
├── contexts/
│   └── auth-context.tsx    # Authentication state management
├── hooks/
│   ├── useRegistrations.ts # Registration data hooks
│   ├── useUsers.ts         # User data hooks
│   └── useSchoolStats.ts   # Dashboard statistics
├── lib/
│   ├── firebase.ts         # Firebase client configuration
│   ├── firebase-admin.ts   # Firebase admin configuration
│   ├── firestore-constants.ts # Database constants
│   ├── paths.ts            # Route constants
│   └── utils.ts            # Utility functions
├── services/
│   └── firestore.ts        # Database service layer
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🗄 Data Structure

### Firestore Collections

```typescript
// users/{userId}
interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  schoolId: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// registrations/{registrationId}
interface Registration {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  status?: "pending" | "approved" | "rejected";
  schoolId?: string; // Set when invited/approved
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
}

// schools/{schoolId}
interface School {
  id: string;
  name: string;
  domain?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Custom Claims Structure

```typescript
interface AdminClaims {
  admin: true;
  schoolId: string;
}
```

## 🛣 Routes

- `/` - Dashboard home (requires admin auth)
- `/register/[id]` - Registration approval page
- `/invite` - Teacher invitation page
- `/login` - Authentication page
- `/forbidden` - Access denied page

## 🧪 Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Code linting
npm run lint

# Code formatting
npm run format

# Admin claims management
npm run admin-claims <action> <email> [schoolId]
```

## 🔒 Security Features

- **Environment Variable Validation**: Ensures all required Firebase config is present
- **Custom Claims Authorization**: Route-level admin verification
- **School-Scoped Access**: Admins can only manage their assigned school
- **Input Validation**: Email validation and duplicate prevention
- **Error Boundaries**: Graceful error handling and user feedback

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Skeleton loaders for better user experience
- **Error Handling**: Clear error messages and recovery paths
- **Real-time Updates**: Live data synchronization with Firestore
- **Semantic Colors**: Consistent color system without hardcoded values

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables

Ensure all environment variables are set in your production environment. The app includes validation to prevent startup with missing configuration.

### Firebase Security Rules

Configure Firestore security rules to match your access patterns:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can manage registrations for their school
    match /registrations/{registrationId} {
      allow read, write: if request.auth != null 
        && request.auth.token.admin == true;
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Conventions

- **TypeScript**: Strict mode enabled, no `any` types allowed
- **File Naming**: kebab-case for files, PascalCase for components
- **Import Organization**: Absolute imports using path aliases
- **Error Handling**: Always use proper TypeScript error handling
- **Comments**: Code should be self-documenting, comments for complex logic only

## 🔧 Troubleshooting

### Common Issues

1. **Firebase Auth Errors**: Verify environment variables and Firebase project configuration
2. **Build Errors**: Ensure all TypeScript types are properly defined
3. **Permission Denied**: Check custom claims and Firestore security rules
4. **Environment Variables**: Use `.env.local` for local development

### Debug Commands

```bash
# Check environment configuration
npm run dev # Will show missing env vars in console

# Validate TypeScript
npx tsc --noEmit

# Check admin claims
npm run admin-claims get user@example.com
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Firebase](https://firebase.google.com/) - Backend services
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework
