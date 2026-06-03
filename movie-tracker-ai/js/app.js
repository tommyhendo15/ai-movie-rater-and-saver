/**
 * Movie Tracker AI - Core Application
 */

const App = {
  init() {
    this.renderNavAuth();
    this.loadPageScripts();
  },

  renderNavAuth() {
    const authContainer = document.getElementById('auth-links');
    if (!authContainer) return;
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
      authContainer.innerHTML = `
        <a href="profile.html">Profile</a>
        <a href="#" id="logout-link">Log Out</a>
      `;
      const logoutLink = document.getElementById('logout-link');
      if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
          e.preventDefault();
          Auth.logout();
        });
      }
    } else {
      authContainer.innerHTML = `
        <a href="login.html">Log In</a>
        <a href="register.html">Register</a>
      `;
    }
  },

  loadPageScripts() {
    const path = window.location.pathname;
    if (path.includes('watchlist')) Movies.initWatchlist();
    if (path.includes('add-movie')) Movies.initAddMovie();
    if (path.includes('edit-movie')) Movies.initEditMovie();
    if (path.includes('home')) Movies.initHome();
    if (path.includes('admin-dashboard')) Admin.init();
    if (path.includes('ai-recommendations')) AI.init();
    if (path.includes('profile')) Auth.initProfile();
    if (path.includes('extended-profile')) Auth.initExtendedProfile();
    if (path.includes('checkpoints')) Admin.initCheckpoints();
  },

  showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    const main = document.querySelector('main') || document.body;
    main.insertBefore(alertDiv, main.firstChild);
    setTimeout(() => alertDiv.remove(), 4000);
  },

  goTo(path) {
    window.location.href = path;
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
