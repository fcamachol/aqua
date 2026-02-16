# ElevenLabs Voice Channel Setup Guide

This guide walks you through setting up the ElevenLabs Voice channel in Chatwoot to enable AI-powered voice calls.

## Prerequisites

Before you begin, you need:

1. **ElevenLabs Account** with Conversational AI access
2. **An ElevenLabs AI Agent** already created and configured in the [ElevenLabs dashboard](https://elevenlabs.io/app/conversational-ai)
3. **ElevenLabs API Key** from your account settings

## Step 1: Get Your ElevenLabs Credentials

### Find Your Agent ID

1. Go to [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai)
2. Click on your agent
3. The **Agent ID** is displayed in the agent settings or URL (e.g., `abc123xyz`)

### Get Your API Key

1. Go to [ElevenLabs Profile Settings](https://elevenlabs.io/app/settings/api-keys)
2. Click **Create API Key** (or copy an existing one)
3. Save this key securely - you'll need it for Chatwoot

### Get Your Phone Number (Optional)

If you've provisioned a phone number for your agent:
1. Go to your agent's settings in ElevenLabs
2. Find the **Phone Number** section
3. Copy the number in E.164 format (e.g., `+1234567890`)

## Step 2: Create the Inbox in Chatwoot

1. Log into your Chatwoot dashboard
2. Navigate to **Settings** → **Inboxes**
3. Click **Add Inbox**
4. Select **ElevenLabs Voice**

### Fill in the Form

| Field | Required | Description |
|-------|----------|-------------|
| **Channel Name** | Yes | A friendly name for this inbox (e.g., "AI Voice Support") |
| **Agent ID** | Yes | Your ElevenLabs agent ID from Step 1 |
| **API Key** | Yes | Your ElevenLabs API key from Step 1 |
| **Phone Number** | No | The phone number associated with this agent (E.164 format) |

5. Click **Create ElevenLabs Voice Channel**
6. Assign agents who should have access to this inbox
7. Click **Finish**

## Step 3: Configure Webhook in ElevenLabs

For Chatwoot to receive call data, you need to configure webhooks in ElevenLabs:

1. Go to your agent in the [ElevenLabs dashboard](https://elevenlabs.io/app/conversational-ai)
2. Navigate to **Agent Settings** → **Webhooks**
3. Add a new webhook with:
   - **URL**: `https://your-chatwoot-domain.com/elevenlabs/webhooks`
   - **Events**: Enable `post_call_transcription`

4. Save the webhook configuration

### Webhook URL Format

Replace `your-chatwoot-domain.com` with your actual Chatwoot domain:

```
https://your-chatwoot-domain.com/elevenlabs/webhooks
```

## What Happens After Setup

Once configured, the integration works automatically:

### When a Call Comes In
1. Customer calls your ElevenLabs phone number
2. ElevenLabs AI handles the conversation
3. After the call ends, ElevenLabs sends a webhook to Chatwoot

### What Chatwoot Creates
- **Contact**: Created from the caller's phone number
- **Conversation**: New conversation in your ElevenLabs Voice inbox
- **Transcript**: Full conversation transcript with AI/Customer labels and timestamps
- **Recording**: Audio file attached to the conversation (if available)
- **Metadata**: Call duration, status, and other details visible in conversation info

### Viewing Call Data

1. Open the conversation in Chatwoot
2. The transcript appears as a message with formatted turn-by-turn dialogue
3. Click the audio attachment to play the recording
4. Expand **Conversation Info** in the right panel to see call metadata (duration, status)

## Troubleshooting

### Inbox Not Clickable
Make sure the `channel_elevenlabs_voice` feature flag is enabled in your Chatwoot installation.

### Webhooks Not Arriving
1. Verify the webhook URL is correct and accessible
2. Check that `post_call_transcription` event is enabled
3. Review Chatwoot logs for webhook errors

### Recordings Not Appearing
- Recordings are fetched via API after the webhook arrives
- Check that your API key has permission to access recordings
- Review logs for download errors (recordings failing won't block transcript creation)

## Support

For issues with:
- **ElevenLabs configuration**: Contact [ElevenLabs Support](https://elevenlabs.io/support)
- **Chatwoot integration**: Check the application logs or open an issue
