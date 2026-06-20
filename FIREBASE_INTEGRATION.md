# Firebase Integration Guide - Goal Tracker

## Overview
Your Goal Tracker app has been successfully integrated with Firebase for authentication and database management. This guide explains the integration and how to use it.

## What's Been Added

### 1. **Firebase Configuration** (`src/firebase.js`)
- Configured Firebase SDK with your project credentials
- Initialized Authentication (Firebase Auth)
- Initialized Firestore Database
- Initialized Google Analytics

### 2. **Authentication System**

#### AuthContext (`src/context/AuthContext.jsx`)
- Global authentication state management
- Automatically tracks user login/logout status
- Provides `useAuth()` hook for accessing user data and logout function

#### Login Component (`src/components/Login.jsx`)
- Email/password login form
- Error handling and loading states
- Beautiful dark-themed UI
- Link to switch to signup page

#### SignUp Component (`src/components/SignUp.jsx`)
- Create new user accounts with email and password
- Display name optional field
- Password validation (minimum 6 characters)
- Password confirmation matching
- Beautiful dark-themed UI

#### AuthPage Component (`src/components/AuthPage.jsx`)
- Manages switching between Login and SignUp views
- Handles the authentication flow

### 3. **Firestore Database Integration** (`src/utils/firestoreDb.js`)
Complete database operations using Firestore:
- `addGoal()` - Create new goals
- `getAllGoals()` - Fetch all goals for current user
- `getActiveGoal()` - Get the currently active goal
- `setActiveGoal()` - Set a goal as active
- `clearActiveGoal()` - Deactivate current goal
- `updateGoalStatus()` - Change goal status (active/paused/done)
- `deleteGoal()` - Remove a goal

**Key Features:**
- All data is automatically associated with the logged-in user via `userId`
- Uses server timestamps for consistency
- Proper sorting by priority and creation date
- Transaction-safe operations

### 4. **Updated Components**

#### App.jsx
- Now wraps the app with `AuthProvider`
- Shows login/signup page when not authenticated
- Shows dashboard when user is logged in
- Loading spinner while checking authentication status

#### Dashboard.jsx
- Updated to use Firestore database (`firestoreDb`) instead of local API
- Real-time data syncing with Firestore
- User-specific goal management

#### Header.jsx
- Added logout button
- Displays current user's name/email
- Logout functionality

#### AddGoalForm.jsx
- Updated to save goals to Firestore
- Saves automatically with user association

#### GoalCard.jsx
- Updated all goal actions (update, delete, set active) to use Firestore
- Complete action handling for goal management

## Firestore Database Structure

### Collection: `goals`
```
{
  id: "auto-generated",
  userId: "firebase-user-id",
  title: "Goal title",
  category: "Work/Health/Learning/etc",
  priority: "high|medium|low",
  status: "active|paused|done",
  is_active: boolean,
  created_at: timestamp,
  updated_at: timestamp
}
```

## How It Works

### 1. **User Registration**
1. Click "Sign Up" link
2. Enter display name (optional), email, and password
3. Confirm password
4. Account is created in Firebase Auth
5. User is automatically logged in

### 2. **User Login**
1. Click "Login" (default)
2. Enter email and password
3. On success, redirected to dashboard

### 3. **Goal Management**
1. All goals are stored in Firestore under the user's ID
2. Goals are fetched automatically on page load
3. Changes sync in real-time (2-second interval)
4. Each goal operation updates Firestore:
   - Creating: `addGoal()`
   - Reading: `getAllGoals()`, `getActiveGoal()`
   - Updating: `setActiveGoal()`, `updateGoalStatus()`
   - Deleting: `deleteGoal()`

### 4. **Logout**
- Click "Logout" button in header
- User session is cleared
- Redirected to login page
- All data is safely stored in Firestore

## Firebase Firestore Security Rules

**IMPORTANT:** Set up these security rules in Firebase Console to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /goals/{goalId} {
      // Only allow users to read/write their own goals
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select "goal-tracker-8dd96" project
3. **Enable Authentication:**
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Anonymous" (optional)

4. **Set up Firestore:**
   - Go to Firestore Database → Create Database
   - Choose "Start in production mode"
   - Choose your region
   - Set the security rules as shown above

5. **Configure CORS (if needed for API calls):**
   - Only needed if making direct requests from frontend to Firestore
   - Currently using Firestore SDK which handles this automatically

## Environment Variables
No additional .env files needed! Firebase config is safely embedded in `src/firebase.js`

## Running the App

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will:
1. Load with login page (if not authenticated)
2. Show sign up option
3. After login, display the full dashboard
4. All goals are stored per user in Firestore
5. Logout clears the session and returns to login

## Features

✅ User Authentication (Email/Password)
✅ User Registration with validation
✅ Secure Firestore Database
✅ Per-user goal management
✅ Real-time goal syncing
✅ Goal CRUD operations
✅ Goal status tracking (active/paused/done)
✅ Priority levels
✅ Categories
✅ Beautiful dark UI
✅ Responsive design

## Next Steps (Optional)

1. **Add Social Login:**
   - Enable Google Sign-In in Firebase Console
   - Add Google login button to AuthPage

2. **Add Password Reset:**
   - Use Firebase `sendPasswordResetEmail()`
   - Add "Forgot Password?" link

3. **Enable Multiple Sign-in Methods:**
   - Google OAuth
   - GitHub OAuth
   - Microsoft

4. **Add User Profile:**
   - Store additional user data in Firestore
   - Add profile picture support
   - Add preferences/settings

5. **Enable Offline Support:**
   - Use Firestore offline persistence
   - Data syncs when back online

6. **Add Email Verification:**
   - Verify email before allowing full access
   - Use Firebase `sendEmailVerification()`

## Troubleshooting

### "Collection 'goals' not found"
- Firestore doesn't require pre-creating collections
- They're created automatically on first write
- Check Firebase Console Firestore tab to see data

### "User UID mismatch"
- Make sure you're logged in
- Clear localStorage and refresh
- Check Firestore security rules

### "Operation not allowed"
- Enable Email/Password auth in Firebase Console
- Check authentication is enabled for your project

## Support

For issues:
1. Check Firebase Console for errors
2. Check browser console for JavaScript errors
3. Verify Firebase credentials in `src/firebase.js`
4. Check Firestore security rules are correct
5. Ensure Firebase project is active and has billing enabled (if past free tier)
