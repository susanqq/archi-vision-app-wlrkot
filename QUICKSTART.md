
# Quick Start Guide - Interior Design AI

Get your Interior Design AI feature up and running in 10 minutes!

## Prerequisites

- Node.js installed
- Expo CLI installed
- A Supabase account (free)
- A Google AI Studio account (free)

## Step 1: Get Your API Keys (5 minutes)

### Supabase Setup
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in project details and wait for provisioning
4. Go to Project Settings > API
5. Copy these values:
   - Project URL
   - anon public key
   - service_role key (keep secret!)

### Gemini API Setup
1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy your API key

## Step 2: Configure Your App (2 minutes)

1. **Create `.env` file** in your project root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Restart your Expo server**:
   ```bash
   npm run dev
   ```

## Step 3: Set Up Supabase Storage (2 minutes)

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name it: `generated-designs`
4. Make it **Public**
5. Click "Create bucket"

## Step 4: Deploy Edge Function (3 minutes)

### Option A: Using Supabase CLI (Recommended)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find project ref in Project Settings > General)

4. **Deploy the function**:
   ```bash
   supabase functions deploy generate-interior-design
   ```

5. **Set secrets**:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   supabase secrets set SUPABASE_URL=your_supabase_url
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Option B: Using Supabase Dashboard

1. Go to **Edge Functions** in Supabase dashboard
2. Click "Create a new function"
3. Name it: `generate-interior-design`
4. Copy the code from `supabase/functions/generate-interior-design/index.ts`
5. Paste it into the editor
6. Click "Deploy"
7. Go to **Edge Functions > Environment Variables**
8. Add:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## Step 5: Create Test User (1 minute)

1. In Supabase dashboard, go to **Authentication > Users**
2. Click "Add user"
3. Email: `test@example.com`
4. Password: `testpassword123`
5. Click "Create user"

## Step 6: Test It! (2 minutes)

1. **Add the debugger to your app** (optional but recommended):
   
   In `app/(tabs)/(home)/index.tsx`, add:
   ```typescript
   import { SupabaseDebugger } from '@/components/SupabaseDebugger';
   
   // Add this somewhere in your component:
   <SupabaseDebugger />
   ```

2. **Sign in with test user**:
   - Open the debugger
   - Click "Sign In Test User"
   - Should see "Authenticated: ✓"

3. **Try generating a design**:
   - Go to Interior Design
   - Upload a room photo
   - Select a design tool
   - Click "Generate with Gemini AI"
   - Wait 10-30 seconds
   - See your AI-generated design!

## Troubleshooting

### "Unauthorized" Error
```bash
# Make sure you're signed in
# Use the SupabaseDebugger to sign in with test user
```

### "Function Error"
```bash
# Check edge function logs in Supabase dashboard
# Verify GEMINI_API_KEY is set correctly
```

### "Upload Failed"
```bash
# Verify storage bucket exists and is public
# Check bucket name is exactly "generated-designs"
```

### Environment Variables Not Loading
```bash
# Restart Expo dev server
npm run dev
```

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Deploy edge function
supabase functions deploy generate-interior-design

# Set secrets
supabase secrets set GEMINI_API_KEY=your_key

# View function logs
supabase functions logs generate-interior-design

# Check Supabase status
supabase status
```

## What's Next?

✅ **You're all set!** Your Interior Design AI is ready to use.

### Optional Enhancements:
- Implement proper authentication UI (see AUTH_SETUP.md)
- Add more design tools
- Customize prompts for different styles
- Add image history and favorites
- Implement sharing features

### Learn More:
- **Full Setup Guide**: SETUP_INSTRUCTIONS.md
- **API Documentation**: API_REFERENCE.md
- **Authentication Guide**: AUTH_SETUP.md
- **Implementation Details**: IMPLEMENTATION_SUMMARY.md

## Need Help?

1. Check the console logs for detailed error messages
2. Use the SupabaseDebugger component to verify setup
3. Review the troubleshooting section in SETUP_INSTRUCTIONS.md
4. Check Supabase dashboard for function logs

## Cost Estimate

**Free Tier Limits:**
- Gemini: 15 requests/minute, 1,500/day
- Supabase: 500MB storage, 500K function calls/month

**Perfect for development and testing!**

---

**Congratulations!** 🎉 You now have a fully functional AI-powered interior design tool!

Try uploading a photo of a room and watch the AI transform it with different design styles.
