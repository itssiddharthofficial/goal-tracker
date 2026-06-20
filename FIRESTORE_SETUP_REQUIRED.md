# ⚠️ CRITICAL: Firestore Security Rules Setup Required

## Why Goals Don't Appear

If goals are not showing up after adding them, it's likely due to **missing Firestore Security Rules**. Without proper rules, your app cannot read or write data to Firestore.

## Step-by-Step Setup

### 1. Go to Firebase Console
- Visit: https://console.firebase.google.com
- Select your "goal-tracker-8dd96" project

### 2. Enable Firestore Database
- Click on **Firestore Database** in the left sidebar
- If not created, click **Create Database**
- Choose:
  - **Location**: US (default)
  - **Mode**: Start in Production mode (we'll set rules)
  - Click **Create**

### 3. Set Up Security Rules (MOST IMPORTANT)

Once Firestore is created:
1. Click on the **Rules** tab
2. Replace all content with the rules below:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own goals
    match /goals/{goalId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click **Publish** (important!)

### 4. Enable Authentication
1. Go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Click on **Email/Password** provider
4. Toggle **Enabled** to ON
5. Click **Save**

## Testing the Setup

After completing the above steps:

1. **Refresh the Goal Tracker** app (http://localhost:3000)
2. **Create a new account** or login
3. **Add a goal** using the "Add Goal" button
4. **Check if it appears** in the list

## Debugging

If goals still don't appear:

### Check Browser Console (F12)
1. Open your browser's Developer Tools (F12)
2. Go to **Console** tab
3. Look for error messages starting with "Error loading goals:"
4. Common errors:
   - `permission-denied` → Security rules not set correctly
   - `auth/operation-not-allowed` → Email/Password auth not enabled
   - `auth/invalid-api-key` → Invalid Firebase credentials

### Check Firestore Data
1. Go to Firestore Database in Firebase Console
2. Look for a **"goals"** collection
3. You should see documents with fields: `title`, `category`, `priority`, `userId`, `created_at`, `updated_at`

If you don't see the collection:
- Check browser console for errors
- Verify security rules are published
- Check that user is authenticated (should see email in header)

### Test the Connection
Try this in browser console:
```javascript
// This will show if Firestore is accessible
fetch('http://localhost:3000').then(r => r.text()).then(console.log)
```

## Common Issues

### Issue: "Cannot read property 'uid' of null"
**Cause**: User is not authenticated
**Solution**: 
- Clear browser cache/localStorage
- Logout and login again
- Make sure you're actually logged in (see email in header)

### Issue: "permission-denied"
**Cause**: Security rules not set or not published
**Solution**:
- Go to Firestore → Rules
- Paste the rules from Step 3 above
- Click **Publish** button (don't just save)
- Wait 30 seconds for rules to propagate
- Refresh the app

### Issue: "Cannot add goal / Goal disappears"
**Cause**: Database operations failing silently
**Solution**:
- Open browser console (F12)
- Look for error messages
- Check Firestore Rules again
- Try adding a goal and check console output

### Issue: Goals show up but can't update them
**Cause**: Update operations blocked by security rules
**Solution**:
- Check all rules are correctly published
- Verify the update operations include proper `userId` checks
- Try deleting and re-adding a goal

## Quick Verification Checklist

- [ ] Firestore Database created in Firebase Console
- [ ] Security rules are pasted and **Published**
- [ ] Email/Password authentication is **Enabled**
- [ ] Browser shows you as logged in (email visible in header)
- [ ] No errors in browser console (F12)
- [ ] You can add a goal
- [ ] Goal appears in Firestore Console under "goals" collection

## Still Having Issues?

1. **Hard refresh the page**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser storage**:
   - F12 → Application → LocalStorage → Clear all
3. **Check Firebase project is active**: 
   - Visit https://console.firebase.google.com/project/goal-tracker-8dd96/settings/general
4. **Restart the server**:
   ```bash
   # Kill the server and restart
   npm start
   ```

## Firebase Console Direct Links

- **Project Settings**: https://console.firebase.google.com/project/goal-tracker-8dd96/settings/general
- **Firestore Database**: https://console.firebase.google.com/project/goal-tracker-8dd96/firestore
- **Authentication**: https://console.firebase.google.com/project/goal-tracker-8dd96/authentication
- **Security Rules**: https://console.firebase.google.com/project/goal-tracker-8dd96/firestore/rules

## After Setup is Complete

Once everything is working:
- Goals will appear instantly after clicking "Add Goal"
- You can edit, delete, and mark goals as complete
- Data is safely stored in your Firebase database
- Each user only sees their own goals
- Your data is accessible from any device where you login
