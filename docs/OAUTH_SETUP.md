# GitHub OAuth Setup Instructions

## Step 1: Create GitHub OAuth App

1. Go to **GitHub Settings**: https://github.com/settings/developers
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"** button
4. Fill in the form:
   - **Application name:** `ThreatModeler`
   - **Homepage URL:** `https://somil149.github.io/threat-modeler/`
   - **Application description:** (optional) `Modern threat modeling web application`
   - **Authorization callback URL:** `https://somil149.github.io/threat-modeler/`
5. Click **"Register application"**
6. You'll see your **Client ID** - copy this value

## Step 2: Update Client ID in Code

1. Open `utils/auth.js`
2. Find line 8:
   ```javascript
   CLIENT_ID: 'YOUR_GITHUB_CLIENT_ID',
   ```
3. Replace `YOUR_GITHUB_CLIENT_ID` with your actual Client ID from Step 1
4. Save the file

## Step 3: Commit and Push

```bash
git add utils/auth.js app.js index.html
git commit -m "feat: add GitHub OAuth login"
git push origin master
```

## Step 4: Test

1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Visit: https://somil149.github.io/threat-modeler/
3. Click "Sign in with GitHub"
4. Authorize the app
5. You should be redirected back and logged in!

## How It Works

- **Login Flow:** User clicks "Sign in with GitHub" → Redirects to GitHub → User authorizes → Redirects back with code → Exchanges code for token → Fetches user profile
- **Storage:** Token and user info stored in localStorage
- **Security:** State parameter prevents CSRF attacks
- **Fallback:** If token exchange fails, uses demo mode

## Features Added

✅ GitHub OAuth login modal on first visit  
✅ User profile with avatar in topbar  
✅ Logout button  
✅ Persistent authentication (localStorage)  
✅ Secure state verification  
✅ Graceful fallback for demo mode  

## Notes

- **Client Secret:** Not needed for client-side OAuth (implicit flow)
- **CORS Proxy:** Uses `cors.isomorphic-git.org` for token exchange (demo purposes)
- **Production:** For production, use a backend service to handle token exchange securely
- **Data Storage:** All threat models still stored locally in browser (GitHub login is for identity only)

## Troubleshooting

**Issue:** "OAuth state mismatch"  
**Fix:** Clear browser cache and try again

**Issue:** "Failed to fetch user"  
**Fix:** Check that Client ID is correct in `utils/auth.js`

**Issue:** Login modal doesn't appear  
**Fix:** Clear localStorage: `localStorage.clear()` in browser console

## Optional: Add Backend for Production

For production use, consider adding a serverless backend (Netlify Functions, Vercel, AWS Lambda) to:
- Securely exchange OAuth code for token
- Store tokens server-side
- Implement token refresh
- Add rate limiting

Example with Netlify Functions:
```javascript
// netlify/functions/oauth-callback.js
exports.handler = async (event) => {
  const { code } = event.queryStringParameters;
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    })
  });
  
  const data = await response.json();
  return { statusCode: 200, body: JSON.stringify(data) };
};
```
