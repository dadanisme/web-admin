# Product Requirements Document: School Admin Dashboard

## Overview

A web administration dashboard for managing school teacher registrations and approvals. Teachers using the iOS app need admin approval to gain full access to their school's resources.

## User Flow

### Teacher Registration Flow

1. Teacher logs into iOS app for the first time
2. iOS app displays only a registration link (no other content accessible)
3. Teacher copies and shares the link with their school administrator
4. After admin approval, teacher gains full access to iOS app features

### Admin Approval Flow

1. Admin receives registration link from teacher
2. Admin opens link in web dashboard
3. Admin views teacher's information and approves/rejects registration
4. Upon approval, teacher's account is assigned to the school

## Technical Requirements

### Authentication

- **Admin Authentication**: Firebase Auth with Google Sign-In only
- **Access Control**: Custom claims required for dashboard access
  - `admin: true` - Identifies user as administrator
  - `schoolId: string` - Restricts admin to specific school
- **Regular Users**: No custom claims (handled by iOS app)

### Data Structure

#### Collections

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

#### Custom Claims Structure

```
{
  admin: true,
  schoolId: "school_id_string"
}
```

### Core Features

#### 1. Registration Management

- **View Pending Registrations**: Display teachers awaiting approval
- **Registration Details**: Show teacher information (name, email, etc.)
- **Approve/Reject Actions**: Update registration status and assign school
- **Registration Link Handling**: Parse registrationId from URL and display relevant data

#### 2. Teacher Invitation

- **Email Invitation**: Admin can invite teachers by email address
- **Auto-Registration**: Create registration entry for non-existent users
- **Email Integration**: Email sending capability (future enhancement)

#### 3. Dashboard Interface

- **Authentication Guard**: Verify admin claims before dashboard access
- **School-Scoped Data**: Only show data relevant to admin's school
- **Responsive Design**: Works on desktop and tablet devices

### User Stories

#### As an Admin:

1. I can log in using my Google account to access the dashboard
2. I can view all pending teacher registrations for my school
3. I can see teacher details when they share their registration link
4. I can approve or reject teacher registrations
5. I can invite teachers by email address
6. I cannot access data from other schools

#### As a Teacher:

1. I receive a registration link when first logging into iOS app
2. I can share this link with my school administrator
3. After approval, I gain full access to iOS app features

### Technical Implementation

#### Frontend (Next.js 15)

- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui (new-york style)
- **Authentication**: Firebase Auth SDK
- **Styling**: Tailwind CSS v4

#### Backend Integration

- **Database**: Firestore
- **Authentication**: Firebase Auth with custom claims
- **Real-time Updates**: Firestore listeners for registration status

### Security Considerations

- Custom claims verification on all protected routes
- School-scoped data access enforcement
- Secure registration link validation
- Admin-only operations protection

### Future Enhancements (Out of Scope)

- Email notification system for invitations
- School creation and management
- Advanced user management features
- Audit logging and analytics
- Nested collections under schools

## Success Criteria

1. Admins can successfully authenticate using Google Sign-In
2. Registration links redirect to dashboard with correct teacher data
3. Approval process correctly assigns teachers to schools
4. Email invitation system creates pending registrations
5. Security: Only authorized admins can access their school's data
6. Performance: Dashboard loads within 2 seconds
7. Compatibility: Works on modern browsers (Chrome, Safari, Firefox)

## Constraints

- Google Sign-In only for admin authentication
- One school per admin limitation
- No email sending in initial version
- Registration links must contain valid registrationId
- Teachers can only belong to one school maximum
