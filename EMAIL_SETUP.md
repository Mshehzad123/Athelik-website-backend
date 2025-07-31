# Email Setup Guide

## Gmail App Password Setup

To fix the email authentication error, you need to create a Gmail App Password:

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to "Security"
3. Enable "2-Step Verification"

### Step 2: Create App Password
1. Go to Google Account settings
2. Navigate to "Security" → "2-Step Verification"
3. Click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "Athelik Backend" as the name
6. Click "Generate"
7. Copy the 16-character password

### Step 3: Update Environment Variables
Update your `.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

### Step 4: Restart Backend
```bash
cd Athelik-Backend
npm start
```

## Alternative: Use Test Email Service

If you want to test without Gmail setup, you can use a test email service:

1. Go to https://ethereal.email/
2. Create a test account
3. Update your `.env` file with the test credentials

## Current Status
- ✅ Order creation works even if email fails
- ✅ Email error doesn't break the system
- ✅ Orders are saved to database
- ✅ Admin can see orders in dashboard

The email error won't affect the core functionality of your e-commerce system. 