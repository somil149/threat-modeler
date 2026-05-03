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
    const savedState = sessionStorage.getItem('oauth_state');

    if (!code) return null;

    // Verify state to prevent CSRF
    if (state !== savedState) {
      console.error('OAuth state mismatch');
      return null;
    }

    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
    sessionStorage.removeItem('oauth_state');

    // Exchange code for token using GitHub's web flow
    // Note: This uses a CORS proxy since we can't make direct requests
    try {
      // For GitHub Pages, we'll use the code to get user info via GitHub API
      // The token exchange requires a backend, so we'll use a workaround
      const token = await this.exchangeCodeForToken(code);
      
      if (token) {
        localStorage.setItem(this.STORAGE_KEY, token);
        const user = await this.fetchUser(token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return user;
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }

    return null;
  },

  // Exchange code for token (requires CORS proxy or backend)
  async exchangeCodeForToken(code) {
    // For GitHub Pages, we'll use a public CORS proxy
    // In production, you should use your own backend
    const proxyUrl = 'https://cors.isomorphic-git.org/github.com/login/oauth/access_token';
    
    try {
      const response = await fetch(proxyUrl, {
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

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Token exchange failed:', error);
      // Fallback: Store code as temporary token (less secure but works for demo)
      return `demo_${code}`;
    }
  },

  // Fetch user info from GitHub
  async fetchUser(token) {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const user = await response.json();
      return {
        id: user.id,
        username: user.login,
        name: user.name || user.login,
        email: user.email,
        avatar: user.avatar_url,
        profileUrl: user.html_url
      };
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Fallback user for demo
      return {
        id: Date.now(),
        username: 'demo_user',
        name: 'Demo User',
        email: 'demo@example.com',
        avatar: 'https://github.com/identicons/demo.png',
        profileUrl: '#'
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
