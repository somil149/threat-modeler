// ========================================
// GitHub OAuth Utility
// ========================================

const GitHubAuth = {
  // Replace with your GitHub OAuth App Client ID
  CLIENT_ID: 'Ov23li7T02IBwQ4gkS5Z', // TODO: Replace this after creating OAuth app
  
  REDIRECT_URI: window.location.origin + window.location.pathname,
  STORAGE_KEY: 'github_auth_token',
  USER_KEY: 'github_user',

  // Initiate OAuth flow
  login() {
    // Check if Client ID is configured
    if (this.CLIENT_ID === 'YOUR_GITHUB_CLIENT_ID' || !this.CLIENT_ID) {
      alert('GitHub OAuth is not configured yet.\n\nPlease update CLIENT_ID in utils/auth.js or click "Continue without login".');
      return;
    }

    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${this.CLIENT_ID}&redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&scope=user:email&state=${state}`;
    
    window.location.href = authUrl;
  },

  // Handle OAuth callback
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    const savedState = sessionStorage.getItem('oauth_state');

    // Check for OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      alert(`GitHub OAuth error: ${error}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      return null;
    }

    if (!code) return null;

    console.log('OAuth callback received, code:', code.substring(0, 10) + '...');

    // Verify state to prevent CSRF
    if (state && savedState && state !== savedState) {
      console.error('OAuth state mismatch. Expected:', savedState, 'Got:', state);
      alert('OAuth state mismatch. Please try logging in again.');
      window.history.replaceState({}, document.title, window.location.pathname);
      sessionStorage.removeItem('oauth_state');
      return null;
    }

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    sessionStorage.removeItem('oauth_state');

    // Exchange code for token using GitHub's web flow
    try {
      console.log('Exchanging code for token...');
      const token = await this.exchangeCodeForToken(code);
      
      if (token) {
        console.log('Token received, fetching user...');
        localStorage.setItem(this.STORAGE_KEY, token);
        const user = await this.fetchUser(token);
        console.log('User fetched:', user.username);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return user;
      } else {
        console.error('No token received');
        alert('Failed to authenticate. Please try again.');
      }
    } catch (error) {
      console.error('OAuth error:', error);
      alert('Authentication failed: ' + error.message);
    }

    return null;
  },

  // Exchange code for token (requires CORS proxy or backend)
  async exchangeCodeForToken(code) {
    // IMPORTANT: GitHub OAuth requires client_secret which cannot be exposed in client-side code
    // For GitHub Pages without backend, we have 3 options:
    
    // Option 1: Use a serverless function (recommended for production)
    // Option 2: Use a CORS proxy (works but less secure)
    // Option 3: Skip token exchange and use code as identifier (demo only)
    
    console.log('Attempting token exchange...');
    
    // Try CORS proxy first
    try {
      const response = await fetch('https://cors.isomorphic-git.org/github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: this.CLIENT_ID,
          code: code,
          redirect_uri: this.REDIRECT_URI
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.access_token) {
        console.log('Token exchange successful via CORS proxy');
        return data.access_token;
      } else if (data.error) {
        console.error('GitHub OAuth error:', data.error, data.error_description);
        throw new Error(data.error_description || data.error);
      }
    } catch (error) {
      console.warn('CORS proxy failed:', error.message);
    }
    
    // Fallback: Use code as demo token (allows app to work without backend)
    console.log('Using demo mode (code as token)');
    return `demo_${code}`;
  },

  // Fetch user info from GitHub
  async fetchUser(token) {
    // If using demo token, create a demo user
    if (token.startsWith('demo_')) {
      console.log('Using demo user (no real GitHub API call)');
      const demoId = token.substring(5, 15);
      return {
        id: demoId,
        username: 'github_user',
        name: 'GitHub User',
        email: 'user@github.com',
        avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        profileUrl: 'https://github.com',
        isDemo: true
      };
    }

    // Real token - fetch from GitHub API
    try {
      console.log('Fetching user from GitHub API...');
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const user = await response.json();
      console.log('GitHub user fetched:', user.login);
      return {
        id: user.id,
        username: user.login,
        name: user.name || user.login,
        email: user.email,
        avatar: user.avatar_url,
        profileUrl: user.html_url,
        isDemo: false
      };
    } catch (error) {
      console.error('Failed to fetch user from GitHub:', error);
      // Fallback to demo user
      return {
        id: Date.now(),
        username: 'github_user',
        name: 'GitHub User',
        email: 'user@github.com',
        avatar: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
        profileUrl: 'https://github.com',
        isDemo: true
      };
    }
  },

  // Get current user
  getUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated() {
    return !!localStorage.getItem(this.STORAGE_KEY);
  },

  // Logout
  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.reload();
  }
};
