/**
 * Admin Module
 */

const Admin = {
  async init() {
    if (!Auth.isAdmin()) {
      App.showAlert('Admin access required.', 'error');
      App.goTo('home.html');
      return;
    }
    this.renderStats();
    this.renderUsersTable();
    this.renderAnnouncements();
    this.setupAnnouncementForm();
  },

  async initCheckpoints() {
    if (!Auth.isAdmin()) {
      App.showAlert('Admin access required.', 'error');
      App.goTo('home.html');
      return;
    }
    const container = document.getElementById('checkpoints-container');
    if (!container) return;
    const checkpoints = [
      { id: 1, title: 'User Registration', status: 'Done', date: '2025-01-15' },
      { id: 2, title: 'Login System', status: 'Done', date: '2025-01-20' },
      { id: 3, title: 'Movie CRUD', status: 'Done', date: '2025-02-01' },
      { id: 4, title: 'Watchlist', status: 'Done', date: '2025-02-10' },
      { id: 5, title: 'AI Recommendations', status: 'In Progress', date: '2025-02-20' },
      { id: 6, title: 'Admin Dashboard', status: 'In Progress', date: '2025-02-25' },
      { id: 7, title: 'Extended Profiles', status: 'Done', date: '2025-02-05' },
      { id: 8, title: 'Analytics & Charts', status: 'Pending', date: '2025-03-01' },
      { id: 9, title: 'Social Features', status: 'Pending', date: '2025-03-15' },
      { id: 10, title: 'Mobile Responsive', status: 'Done', date: '2025-01-30' }
    ];
    container.innerHTML = checkpoints.map(cp => `
      <div class="checkpoint">
        <div>
          <div class="title">${cp.title}</div>
          <div class="status">${cp.status} &middot; ${cp.date}</div>
        </div>
        <span class="badge ${cp.status === 'Done' ? 'badge-watched' : cp.status === 'In Progress' ? 'badge-pending' : 'badge-dropped'}">${cp.status}</span>
      </div>
    `).join('');
  },

  async renderStats() {
    const users = await Auth.getUsers();
    const movies = await Movies.getMovies();
    const announcements = await this.getAnnouncements();
    document.getElementById('stat-users').textContent = users.length;
    document.getElementById('stat-movies').textContent = movies.length;
    document.getElementById('stat-announcements').textContent = announcements.length;
    const watched = movies.filter(m => m.status === 'watched').length;
    document.getElementById('stat-watched').textContent = watched;
  },

  async renderUsersTable() {
    const users = await Auth.getUsers();
    const tbody = document.getElementById('users-table-body');
    if (!tbody) return;
    tbody.innerHTML = users.map(u => `
      <tr>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-watched' : 'badge-pending'}">${u.role}</span></td>
        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
        <td>
          <button class="btn btn-secondary btn-sm toggle-role" data-id="${u.id}">Toggle Role</button>
          <button class="btn btn-danger btn-sm delete-user" data-id="${u.id}">Delete</button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.toggle-role').forEach(btn => {
      btn.addEventListener('click', async () => {
        const allUsers = await Auth.getUsers();
        const idx = allUsers.findIndex(u => u.id === btn.dataset.id);
        if (idx === -1) return;
        allUsers[idx].role = allUsers[idx].role === 'admin' ? 'user' : 'admin';
        await Auth.saveUsers(allUsers);
        this.renderUsersTable();
        this.renderStats();
        App.showAlert('Role updated.', 'success');
      });
    });

    tbody.querySelectorAll('.delete-user').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this user?')) return;
        const allUsers = await Auth.getUsers();
        const filtered = allUsers.filter(u => u.id !== btn.dataset.id);
        await Auth.saveUsers(filtered);
        this.renderUsersTable();
        this.renderStats();
        App.showAlert('User deleted.', 'info');
      });
    });
  },

  async renderAnnouncements() {
    const announcements = await this.getAnnouncements();
    const container = document.getElementById('announcements-container');
    if (!container) return;
    container.innerHTML = announcements.map(a => `
      <div class="announcement">
        <div class="date">${new Date(a.date).toLocaleDateString()}</div>
        <div class="title">${a.title}</div>
        <div class="content">${a.content}</div>
      </div>
    `).join('');
  },

  setupAnnouncementForm() {
    const form = document.getElementById('announcement-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const announcements = await this.getAnnouncements();
      announcements.unshift({
        id: crypto.randomUUID(),
        title: document.getElementById('announcement-title').value.trim(),
        content: document.getElementById('announcement-content').value.trim(),
        date: new Date().toISOString()
      });
      await this.saveAnnouncements(announcements);
      this.renderAnnouncements();
      this.renderStats();
      form.reset();
      App.showAlert('Announcement posted!', 'success');
    });
  },

  async getAnnouncements() {
    const raw = localStorage.getItem('announcements');
    return raw ? JSON.parse(raw) : [];
  },

  async saveAnnouncements(list) {
    localStorage.setItem('announcements', JSON.stringify(list));
  }
};
