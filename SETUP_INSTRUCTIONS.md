
# Interior Design AI Backend Setup Instructions

This guide will help you set up the backend API for the Interior Design module using Google's Gemini AI and Supabase.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- A Google AI Studio account for Gemini API access (https://aistudio.google.com)
- Supabase CLI installed (optional, for local development)

## Step 1: Set Up Supabase Project

1. **Create a Supabase Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Fill in your project details
   - Wait for the project to be provisioned

2. **Get Your Supabase Credentials**
   - Go to Project Settings > API
   - Copy your `Project URL` (SUPABASE_URL)
   - Copy your `anon public` key (SUPABASE_ANON_KEY)
   - Copy your `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

## Step 2: Get Gemini API Key

1. **Get Your Gemini API Key**
   - Go to https://aistudio.google.com/apikey
   - Click "Create API Key"
   - Copy your API key (GEMINI_API_KEY)

## Step 3: Create Storage Bucket

1. **Create a Storage Bucket for Generated Images**
   - In your Supabase dashboard, go to Storage
   - Click "Create a new bucket"
   - Name it `generated-designs`
   - Make it **public** (so users can view their generated images)
   - Click "Create bucket"

2. **Set Bucket Policies**
   - Click on the `generated-designs` bucket
   - Go to "Policies"
   - Add a policy to allow authenticated users to upload:
     ```sql
     CREATE POLICY "Users can upload their own designs"
     ON storage.objects FOR INSERT
     TO authenticated
     WITH CHECK (bucket_id = 'generated-designs' AND auth.uid()::text = (storage.foldername(name))[1]);
     ```
   - Add a policy to allow public read access:
     ```sql
     CREATE POLICY "Public can view designs"
     ON storage.objects FOR SELECT
     TO public
     USING (bucket_id = 'generated-designs');
     ```

## Step 4: Deploy Edge Function

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```
   (Find your project ref in Project Settings > General)

4. **Deploy the Edge Function**
   ```bash
   supabase functions deploy generate-interior-design
   ```

## Step 5: Set Environment Variables

1. **Set Edge Function Environment Variables**
   - In Supabase dashboard, go to Edge Functions
   - Click on "Environment Variables"
   - Add the following variables:
     - `GEMINI_API_KEY`: Your Gemini API key
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

   Or use the CLI:
   ```bash
   supabase secrets set GEMINI_API_KEY=your_gemini_api_key
   supabase secrets set SUPABASE_URL=your_supabase_url
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Step 6: Configure Your React Native App

1. **Create a `.env` file** in your project root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Restart your Expo development server**
   ```bash
   npm run dev
   ```

## Step 7: Enable Authentication (Optional but Recommended)

For production use, you should enable authentication:

1. **Enable Email Authentication**
   - In Supabase dashboard, go to Authentication > Providers
   - Enable Email provider
   - Configure email templates as needed

2. **Add Authentication to Your App**
   - Implement sign-up/sign-in screens
   - Use Supabase Auth in your app
   - The edge function already checks for authenticated users

## Testing the Integration

1. **Test the Edge Function**
   - Open your app
   - Navigate to Interior Design
   - Upload an image
   - Select a design tool
   - Click "Generate with Gemini AI"
   - Wait for the AI to process (usually 10-30 seconds)
   - View your generated design!

## Troubleshooting

### "Unauthorized" Error
- Make sure you have valid Supabase credentials in your `.env` file
- Check that authentication is working (if enabled)

### "Function Error" or "Provider Error"
- Verify your GEMINI_API_KEY is correct and active
- Check the Edge Function logs in Supabase dashboard
- Ensure you have sufficient Gemini API quota

### "Upload Failed" Error
- Verify the `generated-designs` bucket exists
- Check bucket policies allow uploads
- Ensure SUPABASE_SERVICE_ROLE_KEY is set correctly

### Image Not Displaying
- Verify the bucket is set to public
- Check the public read policy is in place
- Inspect the returned URL in the console logs

## API Limits and Costs

### Gemini API
- Free tier: 15 requests per minute
- Check current pricing at https://ai.google.dev/pricing

### Supabase
- Free tier: 500MB storage, 2GB bandwidth
- Edge Functions: 500K invocations/month
- Check current pricing at https://supabase.com/pricing

## Next Steps

- Implement authentication for production use
- Add rate limiting to prevent abuse
- Implement image optimization before upload
- Add more design tools and customization options
- Store generation history in a database table
- Add social sharing features

## Support

For issues with:
- **Supabase**: https://supabase.com/docs
- **Gemini API**: https://ai.google.dev/docs
- **This App**: Check the console logs and error messages

## Security Notes

⚠️ **Important Security Considerations:**

1. Never commit your `.env` file to version control
2. Keep your `service_role` key secret - it has full database access
3. Implement proper authentication before deploying to production
4. Add rate limiting to prevent API abuse
5. Monitor your API usage to avoid unexpected costs
6. Validate and sanitize all user inputs
7. Consider implementing content moderation for generated images

---

**Congratulations!** Your Interior Design AI backend is now set up and ready to use! 🎉
