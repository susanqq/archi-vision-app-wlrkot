
# Setup Checklist ✅

Use this checklist to ensure everything is configured correctly for the Interior Design AI feature.

## Pre-Setup

- [ ] Node.js installed (v18 or higher)
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Git installed (optional)
- [ ] Code editor (VS Code recommended)

## Account Creation

- [ ] Supabase account created (https://supabase.com)
- [ ] Google AI Studio account created (https://aistudio.google.com)
- [ ] Supabase project created
- [ ] Gemini API key obtained

## Project Configuration

### Environment Variables
- [ ] `.env` file created in project root
- [ ] `EXPO_PUBLIC_SUPABASE_URL` added to `.env`
- [ ] `EXPO_PUBLIC_SUPABASE_ANON_KEY` added to `.env`
- [ ] Expo dev server restarted after adding `.env`

### Dependencies
- [ ] `@supabase/supabase-js` installed
- [ ] `@react-native-async-storage/async-storage` installed
- [ ] All dependencies installed (`npm install`)

## Supabase Setup

### Storage
- [ ] Storage bucket `generated-designs` created
- [ ] Bucket set to **Public**
- [ ] Bucket policies configured for:
  - [ ] Authenticated users can upload
  - [ ] Public can read

### Authentication
- [ ] Email authentication enabled
- [ ] Test user created:
  - Email: `test@example.com`
  - Password: `testpassword123`
- [ ] Email confirmation disabled (for testing)

### Edge Function
- [ ] Supabase CLI installed (`npm install -g supabase`)
- [ ] Logged into Supabase CLI (`supabase login`)
- [ ] Project linked (`supabase link`)
- [ ] Edge function deployed (`supabase functions deploy generate-interior-design`)
- [ ] Edge function environment variables set:
  - [ ] `GEMINI_API_KEY`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`

## Testing

### Connection Test
- [ ] SupabaseDebugger component added to app
- [ ] "Connected: ✓" shows in debugger
- [ ] No connection errors in console

### Authentication Test
- [ ] Can sign in with test user
- [ ] "Authenticated: ✓" shows in debugger
- [ ] User email displays correctly
- [ ] Can sign out successfully

### Storage Test
- [ ] Can view storage bucket in Supabase dashboard
- [ ] Bucket shows as public
- [ ] No permission errors

### Edge Function Test
- [ ] Function appears in Edge Functions list
- [ ] Function status shows as "Active"
- [ ] Environment variables are set
- [ ] Can view function logs

### End-to-End Test
- [ ] App launches without errors
- [ ] Can navigate to Interior Design screen
- [ ] Can upload an image
- [ ] Can select a design tool
- [ ] "Generate with Gemini AI" button appears
- [ ] Can click generate button
- [ ] Loading indicator appears
- [ ] Generation completes (10-30 seconds)
- [ ] Generated image displays
- [ ] No errors in console
- [ ] Success message appears

## Troubleshooting Completed

If you encountered issues, check these:

- [ ] Reviewed console logs for errors
- [ ] Checked Supabase function logs
- [ ] Verified all environment variables
- [ ] Confirmed API keys are valid
- [ ] Tested with SupabaseDebugger
- [ ] Restarted Expo dev server
- [ ] Cleared app cache/data

## Documentation Review

- [ ] Read QUICKSTART.md
- [ ] Read SETUP_INSTRUCTIONS.md
- [ ] Reviewed API_REFERENCE.md
- [ ] Checked AUTH_SETUP.md
- [ ] Read IMPLEMENTATION_SUMMARY.md

## Optional Enhancements

- [ ] Implemented proper authentication UI
- [ ] Added user profile screen
- [ ] Implemented password reset
- [ ] Added generation history
- [ ] Implemented favorites/saved designs
- [ ] Added sharing functionality
- [ ] Customized design prompts
- [ ] Added more design tools
- [ ] Implemented rate limiting
- [ ] Added analytics tracking

## Production Readiness

- [ ] Authentication properly implemented
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Error tracking set up
- [ ] Usage monitoring enabled
- [ ] Backup strategy in place
- [ ] Cost alerts configured
- [ ] Terms of service added
- [ ] Privacy policy added
- [ ] User feedback mechanism

## Performance Optimization

- [ ] Image compression before upload
- [ ] Caching implemented
- [ ] Loading states optimized
- [ ] Error recovery implemented
- [ ] Offline handling added
- [ ] Network error handling

## Security Checklist

- [ ] `.env` file in `.gitignore`
- [ ] Service role key kept secret
- [ ] Row Level Security enabled
- [ ] Input validation implemented
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Content moderation considered

## Final Verification

- [ ] All tests passing
- [ ] No console errors
- [ ] No console warnings
- [ ] App performs smoothly
- [ ] UI is responsive
- [ ] Loading states work correctly
- [ ] Error messages are clear
- [ ] Success feedback is visible

---

## Status Summary

**Setup Progress:** ___/100 items completed

**Status:**
- [ ] Not Started
- [ ] In Progress
- [ ] Testing
- [ ] Complete ✅

**Notes:**
_Add any notes or issues encountered during setup_

---

## Quick Reference

### Important URLs
- Supabase Dashboard: https://supabase.com/dashboard
- Google AI Studio: https://aistudio.google.com
- Gemini API Docs: https://ai.google.dev/docs

### Important Commands
```bash
# Start dev server
npm run dev

# Deploy edge function
supabase functions deploy generate-interior-design

# View function logs
supabase functions logs generate-interior-design

# Set secrets
supabase secrets set KEY=value
```

### Support Files
- Quick Start: QUICKSTART.md
- Full Setup: SETUP_INSTRUCTIONS.md
- API Docs: API_REFERENCE.md
- Auth Guide: AUTH_SETUP.md

---

**Once all items are checked, your Interior Design AI is ready for use!** 🎉

Save this checklist and refer back to it when setting up new environments or troubleshooting issues.
