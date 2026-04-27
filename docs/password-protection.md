# Password Protection

> Optional secondary password layer on top of Nextcloud authentication for enhanced financial data security.

## Overview

Password Protection adds an extra layer of security to your financial data. Even after logging into Nextcloud, users must enter a separate app-specific password before accessing the Budget app. This is useful in environments where multiple people may have access to your Nextcloud session, or for additional peace of mind when managing sensitive financial information.

## Setting Up

To enable password protection:

1. Navigate to **Settings > Security**
2. Toggle **Password Protection** to enabled
3. Enter your desired app password
4. Confirm the password
5. Click **Save**

The lock screen will activate immediately for future visits to the app.

> **Tip:** Choose a password that is different from your Nextcloud login password for maximum security.

## How It Works

Once enabled, the Budget app displays a lock screen every time you open it. The workflow is:

1. Log into Nextcloud as normal
2. Open the Budget app
3. A lock screen appears requesting your app password
4. Enter the correct password to access your data
5. Your session remains active until the configured timeout period expires

All budget data is completely inaccessible until the correct password is entered. API endpoints are also protected and will return authentication errors without a valid session.

## Session Timeout

After successfully entering your password, your session persists for a configurable duration:

| Timeout | Best For |
|---------|----------|
| **15 minutes** | Shared computers, high-security environments |
| **30 minutes** | Balanced security and convenience |
| **60 minutes** | Personal devices, longer working sessions |

Configure the timeout in **Settings > Security** under **Session Timeout**.

> **Note:** The timeout is based on inactivity. Any interaction with the app resets the timer.

## Auto-Lock

The app locks automatically in two ways:

- **Inactivity timeout** - When the configured session timeout expires without interaction, you are returned to the lock screen
- **Manual lock** - Click the **Lock** button in the sidebar to immediately lock the app without waiting for the timeout

After locking, you must re-enter your password to continue using the app.

## Failed Attempts

To protect against brute-force attacks:

- After **5 failed password attempts**, a **5-minute lockout** is triggered
- During lockout, no login attempts are accepted, even with the correct password
- The lockout counter resets after a successful login
- Failed attempts are logged for security auditing

> **Warning:** If you are locked out, you must wait the full 5 minutes before trying again. There is no way to bypass the lockout.

## Removing Password Protection

To disable password protection:

1. Navigate to **Settings > Security**
2. Toggle **Password Protection** to disabled
3. Confirm the action

Your existing session is immediately cleared and the lock screen will no longer appear. The stored password is deleted.

> **Note:** Disabling password protection does not affect your Nextcloud login or any other security settings.

## Related Features

- [Settings](settings.md) - General app configuration including security options
