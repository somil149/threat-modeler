// ========================================
// Firebase Authentication Utility
// Supports: Google, GitHub, Microsoft, Twitter
// ========================================

const FirebaseAuth = {
  config: {
    apiKey: "AIzaSyDyTiagxBNth4Vf-yCySRnrMBh71vEygFM",
    authDomain: "threat-modeler2026.firebaseapp.com",
    projectId: "threat-modeler2026",
    storageBucket: "threat-modeler2026.firebasestorage.app",
    messagingSenderId: "750163991791",
    appId: "1:750163991791:web:2452c3fd2e3a17db604f1a"
  },

  auth: null,
  currentUser: null,

  init() {
    if (typeof firebase === 'undefined') {
      console.error('Firebase SDK not loaded');
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(this.config);
      }
      this.auth = firebase.auth();
      
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.currentUser = this.formatUser(user);
          localStorage.setItem('firebase_user', JSON.stringify(this.currentUser));
          window.dispatchEvent(new CustomEvent('authStateChanged', { detail: this.currentUser }));
        } else {
          this.currentUser = null;
          localStorage.removeItem('firebase_user');
          window.dispatchEvent(new CustomEvent('authStateChanged', { detail: null }));
        }
      });

      return true;
    } catch (error) {
      console.error('Firebase init error:', error);
      return false;
    }
  },

  formatUser(firebaseUser) {
    return {
      id: firebaseUser.uid,
      username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
      name: firebaseUser.displayName || 'User',
      email: firebaseUser.email,
      avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=6366f1&color=fff`,
      provider: firebaseUser.providerData[0]?.providerId || 'unknown'
    };
  },

  async loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await this.auth.signInWithPopup(provider);
    return this.formatUser(result.user);
  },

  async loginWithGitHub() {
    const provider = new firebase.auth.GithubAuthProvider();
    const result = await this.auth.signInWithPopup(provider);
    return this.formatUser(result.user);
  },

  async loginWithMicrosoft() {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    const result = await this.auth.signInWithPopup(provider);
    return this.formatUser(result.user);
  },

  async loginWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    const result = await this.auth.signInWithPopup(provider);
    return this.formatUser(result.user);
  },

  async loginWithEmailPassword(email, password) {
    const result = await this.auth.signInWithEmailAndPassword(email, password);
    return this.formatUser(result.user);
  },

  async registerWithEmail(email, password, displayName) {
    const result = await this.auth.createUserWithEmailAndPassword(email, password);
    if (displayName) {
      await result.user.updateProfile({ displayName });
    }
    return this.formatUser(result.user);
  },

  getUser() {
    if (this.currentUser) return this.currentUser;
    const stored = localStorage.getItem('firebase_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      return this.currentUser;
    }
    return null;
  },

  isAuthenticated() {
    return !!this.getUser();
  },

  async logout() {
    await this.auth.signOut();
    this.currentUser = null;
    localStorage.removeItem('firebase_user');
    window.location.reload();
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => FirebaseAuth.init());
} else {
  FirebaseAuth.init();
}
