# Email Notification Setup Guide

This guide explains how to set up email notifications for the weekly dataset update workflow.

## Prerequisites

You need a Gmail account to send email notifications. If you use a different email provider, you'll need to adjust the SMTP settings in the workflow file.

## Step 1: Generate Gmail App Password

Since Gmail requires App Passwords for third-party applications:

1. Go to your Google Account: https://myaccount.google.com/
2. Select **Security** from the left menu
3. Under "How you sign in to Google," select **2-Step Verification** (you must enable this first if not already enabled)
4. At the bottom, select **App passwords**
5. Select app: **Mail**
6. Select device: **Other (Custom name)** → Enter "GitHub Actions"
7. Click **Generate**
8. Copy the 16-character password (you won't be able to see it again)

## Step 2: Add Secrets to GitHub Repository

1. Go to your GitHub repository: https://github.com/songys/Korean-HF-datasets-catalog
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** and add the following three secrets:

### Secret 1: EMAIL_USERNAME
- **Name:** `EMAIL_USERNAME`
- **Value:** Your Gmail address (e.g., `your.email@gmail.com`)

### Secret 2: EMAIL_PASSWORD
- **Name:** `EMAIL_PASSWORD`
- **Value:** The 16-character App Password you generated in Step 1

### Secret 3: EMAIL_TO
- **Name:** `EMAIL_TO`
- **Value:** The email address where you want to receive notifications (can be the same as EMAIL_USERNAME)

## Step 3: Verify Setup

Once the secrets are added, the workflow will automatically send email notifications on the next scheduled run (every Monday at 9 AM KST).

You can also test it manually:
1. Go to **Actions** tab in your repository
2. Select **Update Korean Datasets** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for the workflow to complete
5. Check your email inbox for the notification

## Email Notification Contents

The email will include:
- ✅ Workflow execution status (Success/Failure)
- 📊 Current statistics (total datasets, downloads, likes, multilingual datasets)
- 📈 Trend information (growth rate, weeks tracked, date range)
- ℹ️ Update status (whether changes were detected or not)
- 🔗 Links to the trends page, main page, and workflow run

## Troubleshooting

### Email not received?

1. **Check spam folder:** GitHub Actions emails might be filtered as spam
2. **Verify secrets:** Make sure all three secrets are set correctly (no extra spaces)
3. **Check workflow run:** Go to Actions tab and check if the "Send email notification" step succeeded
4. **Gmail security:** If using Gmail, make sure:
   - 2-Step Verification is enabled
   - You used an App Password (not your regular password)
   - "Less secure app access" is NOT needed (App Passwords are the secure method)

### Using a different email provider?

If you want to use a different email provider instead of Gmail, update the workflow file:

```yaml
server_address: smtp.gmail.com  # Change this
server_port: 587                # Change this if needed
```

Common SMTP settings:
- **Gmail:** smtp.gmail.com:587
- **Outlook/Hotmail:** smtp-mail.outlook.com:587
- **Yahoo:** smtp.mail.yahoo.com:587
- **Custom SMTP:** Use your provider's SMTP server address and port

## GitHub Step Summary

In addition to email notifications, you can also view a detailed summary directly on GitHub:

1. Go to **Actions** tab
2. Click on the workflow run
3. Scroll down to see the **Summary** section with:
   - Current statistics
   - Trend information
   - Direct links to the website

This summary is available even if email notifications fail.
