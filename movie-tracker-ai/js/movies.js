/**
 * Movies Module
 */

const Movies = {
  async getMovies() {
    const raw = localStorage.getItem('movies');
    return raw ? JSON.parse(raw) : [];
  },

  async saveMovies(movies) {
    localStorage.setItem('movies', JSON.stringify(movies));
  },

  async initHome() {
    const movies = await this.getMovies();
    const container = document.getElementById('movie-grid');
    if (!container) return;
    container.innerHTML = movies.length
      ? movies.map(m => this.renderMovieCard(m)).join('')
      : '<p class="text-center">No movies yet. <a href="add-movie.html">Add one</a>.</p>';
    this.attachCardListeners();
  },

  async initWatchlist() {
    const user = Auth.getCurrentUser();
    if (!user) {
      App.goTo('login.html');
      return;
    }
    const movies = await this.getMovies();
    const userMovies = movies.filter(m => m.userId === user.id);
    const container = document.getElementById('watchlist-container');
    if (!container) return;
    container.innerHTML = userMovies.length
      ? userMovies.map(m => this.renderWatchlistItem(m)).join('')
      : '<p class="text-center">Your watchlist is empty. <a href="add-movie.html">Add a movie</a>.</p>';
    this.attachWatchlistListeners();
  },

  async initAddMovie() {
    const user = Auth.getCurrentUser();
    if (!user) {
      App.goTo('login.html');
      return;
    }
    const form = document.getElementById('add-movie-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const movies = await this.getMovies();
      const newMovie = {
        id: crypto.randomUUID(),
        userId: user.id,
        title: document.getElementById('movie-title').value.trim(),
        year: parseInt(document.getElementById('movie-year').value),
        genre: document.getElementById('movie-genre').value,
        director: document.getElementById('movie-director').value.trim(),
        rating: parseFloat(document.getElementById('movie-rating').value) || 0,
        status: document.getElementById('movie-status').value,
        review: document.getElementById('movie-review').value.trim(),
        poster: document.getElementById('movie-poster').value.trim() || '',
        createdAt: new Date().toISOString()
      };
      movies.push(newMovie);
      await this.saveMovies(movies);
      App.showAlert('Movie added!', 'success');
      setTimeout(() => App.goTo('watchlist.html'), 1000);
    });
  },

  async initEditMovie() {
    const user = Auth.getCurrentUser();
    if (!user) {
      App.goTo('login.html');
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');
    if (!movieId) {
      App.goTo('watchlist.html');
      return;
    }
    const movies = await this.getMovies();
    const movie = movies.find(m => m.id === movieId && m.userId === user.id);
    if (!movie) {
      App.showAlert('Movie not found.', 'error');
      App.goTo('watchlist.html');
      return;
    }
    document.getElementById('movie-id').value = movie.id;
    document.getElementById('movie-title').value = movie.title;
    document.getElementById('movie-year').value = movie.year;
    document.getElementById('movie-genre').value = movie.genre;
    document.getElementById('movie-director').value = movie.director;
    document.getElementById('movie-rating').value = movie.rating;
    document.getElementById('movie-status').value = movie.status;
    document.getElementById('movie-review').value = movie.review || '';
    document.getElementById('movie-poster').value = movie.poster || '';

    const form = document.getElementById('edit-movie-form');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idx = movies.findIndex(m => m.id === movieId);
      if (idx === -1) return;
      movies[idx] = {
        ...movies[idx],
        title: document.getElementById('movie-title').value.trim(),
        year: parseInt(document.getElementById('movie-year').value),
        genre: document.getElementById('movie-genre').value,
        director: document.getElementById('movie-director').value.trim(),
        rating: parseFloat(document.getElementById('movie-rating').value) || 0,
        status: document.getElementById('movie-status').value,
        review: document.getElementById('movie-review').value.trim(),
        poster: document.getElementById('movie-poster').value.trim() || ''
      };
      await this.saveMovies(movies);
      App.showAlert('Movie updated!', 'success');
      setTimeout(() => App.goTo('watchlist.html'), 800);
    });

    const deleteBtn = document.getElementById('delete-movie-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async () => {
        if (!confirm('Delete this movie?')) return;
        const filtered = movies.filter(m => m.id !== movieId);
        await this.saveMovies(filtered);
        App.showAlert('Movie deleted.', 'info');
        setTimeout(() => App.goTo('watchlist.html'), 800);
      });
    }
  },

  renderMovieCard(movie) {
    const poster = movie.poster || 'assets/images/placeholder.svg';
    return `
      <div class="movie-card" data-id="${movie.id}">
        <img src="${poster}" alt="${movie.title}" onerror="this.src='../assets/images/placeholder.svg'" />
        <div class="movie-info">
          <h3>${this.escape(movie.title)}</h3>
          <div class="meta">${movie.year} &middot; ${movie.genre} &middot; ${movie.director}</div>
          <div class="rating">${movie.rating}/10</div>
        </div>
      </div>
    `;
  },

  renderWatchlistItem(movie) {
    const statusBadge = {
      watched: 'badge-watched',
      pending: 'badge-pending',
      dropped: 'badge-dropped'
    }[movie.status] || 'badge-pending';
    return `
      <div class="watchlist-item" data-id="${movie.id}">
        <div class="info">
          <h3>${this.escape(movie.title)}</h3>
          <p>${movie.year} &middot; ${movie.genre} &middot; ${movie.rating}/10</p>
          <span class="badge ${statusBadge}">${movie.status}</span>
        </div>
        <div class="actions">
          <a href="edit-movie.html?id=${movie.id}" class="btn btn-secondary">Edit</a>
          <button class="btn btn-danger delete-btn" data-id="${movie.id}">Delete</button>
        </div>
      </div>
    `;
  },

  attachCardListeners() {
    document.querySelectorAll('.movie-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        App.goTo(`edit-movie.html?id=${id}`);
      });
    });
  },

  attachWatchlistListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (!confirm('Delete this movie?')) return;
        const movies = await this.getMovies();
        const filtered = movies.filter(m => m.id !== id);
        await this.saveMovies(filtered);
        btn.closest('.watchlist-item').remove();
        App.showAlert('Movie deleted.', 'info');
      });
    });
  },

  escape(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
