/**
 * Authentication Module
 */

const Auth = {
  async init() {
    this.setupRegisterForm();
    this.setupLoginForm();
  },

  setupRegisterForm() {
    const form = document.getElementById('register-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      if (password !== confirmPassword) {
        App.showAlert('Passwords do not match.', 'error');
        return;
      }
      const users = await this.getUsers();
      if (users.find(u => u.email === email)) {
        App.showAlert('Email already registered.', 'error');
        return;
      }
      const newUser = {
        id: crypto.randomUUID(),
        username,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString(),
        profile: { bio: '', avatar: '', location: '', birthDate: '', favoriteGenres: [], socialLinks: {} }
      };
      users.push(newUser);
      await this.saveUsers(users);
      App.showAlert('Registration successful! Please log in.', 'success');
      setTimeout(() => App.goTo('login.html'), 1500);
    });
  },

  setupLoginForm() {
    const form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const users = await this.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        App.showAlert('Invalid email or password.', 'error');
        return;
      }
      localStorage.setItem('currentUser', JSON.stringify(user));
      App.showAlert('Welcome back!', 'success');
      setTimeout(() => App.goTo('home.html'), 1000);
    });
  },

  initProfile() {
    const user = this.getCurrentUser();
    if (!user) {
      App.goTo('login.html');
      return;
    }
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-role').textContent = user.role;
    document.getElementById('profile-joined').textContent = new Date(user.createdAt).toLocaleDateString();
    const bioEl = document.getElementById('profile-bio');
    if (bioEl) bioEl.textContent = user.profile?.bio || 'No bio yet.';
  },

  initExtendedProfile() {
    const user = this.getCurrentUser();
    if (!user) {
      App.goTo('login.html');
      return;
    }
    const form = document.getElementById('extended-profile-form');
    if (!form) return;
    document.getElementById('ep-bio').value = user.profile?.bio || '';
    document.getElementById('ep-location').value = user.profile?.location || '';
    document.getElementById('ep-birthdate').value = user.profile?.birthDate || '';
    document.getElementById('ep-favgenres').value = (user.profile?.favoriteGenres || []).join(', ');
    document.getElementById('ep-twitter').value = user.profile?.socialLinks?.twitter || '';
    document.getElementById('ep-instagram').value = user.profile?.socialLinks?.instagram || '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const users = await this.getUsers();
      const idx = users.findIndex(u => u.id === user.id);
      if (idx === -1) return;
      users[idx].profile = {
        bio: document.getElementById('ep-bio').value,
        location: document.getElementById('ep-location').value,
        birthDate: document.getElementById('ep-birthdate').value,
        favoriteGenres: document.getElementById('ep-favgenres').value.split(',').map(s => s.trim()).filter(Boolean),
        socialLinks: {
          twitter: document.getElementById('ep-twitter').value,
          instagram: document.getElementById('ep-instagram').value
        }
      };
      await this.saveUsers(users);
      localStorage.setItem('currentUser', JSON.stringify(users[idx]));
      App.showAlert('Profile updated!', 'success');
    });
  },

  getCurrentUser() {
    const raw = localStorage.getItem('currentUser');
    return raw ? JSON.parse(raw) : null;
  },

  async getUsers() {
    const raw = localStorage.getItem('users');
    return raw ? JSON.parse(raw) : [];
  },

  async saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  },

  logout() {
    localStorage.removeItem('currentUser');
    App.showAlert('Logged out successfully.', 'info');
    setTimeout(() => App.goTo('../index.html'), 800);
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }
};

Auth.init();
