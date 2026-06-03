/**
 * AI Recommendations Module
 */

const AI = {
  async init() {
    const user = Auth.getCurrentUser();
    if (!user) {
      App.showAlert('Log in to get AI recommendations.', 'info');
      return;
    }
    this.renderRecommendations(user);
  },

  async renderRecommendations(user) {
    const container = document.getElementById('ai-recommendations-container');
    if (!container) return;
    const movies = await Movies.getMovies();
    const userMovies = movies.filter(m => m.userId === user.id);
    const recommendations = this.generateRecommendations(userMovies, user);
    container.innerHTML = recommendations.length
      ? recommendations.map(r => this.renderRecommendationCard(r)).join('')
      : '<p class="text-center">Watch and rate some movies to get AI recommendations.</p>';
  },

  generateRecommendations(userMovies, user) {
    const allMovies = [
      { title: 'Inception', year: 2010, genre: 'Sci-Fi', director: 'Christopher Nolan', rating: 8.8, reason: 'Based on your love for mind-bending narratives.' },
      { title: 'The Matrix', year: 1999, genre: 'Sci-Fi', director: 'The Wachowskis', rating: 8.7, reason: 'You enjoy complex sci-fi with philosophical depth.' },
      { title: 'Interstellar', year: 2014, genre: 'Sci-Fi', director: 'Christopher Nolan', rating: 8.6, reason: 'Matches your preference for epic space dramas.' },
      { title: 'Pulp Fiction', year: 1994, genre: 'Crime', director: 'Quentin Tarantino', rating: 8.9, reason: 'Your taste for non-linear storytelling suggests this.' },
      { title: 'The Dark Knight', year: 2008, genre: 'Action', director: 'Christopher Nolan', rating: 9.0, reason: 'Highly rated action films align with your watchlist.' },
      { title: 'Fight Club', year: 1999, genre: 'Drama', director: 'David Fincher', rating: 8.8, reason: 'Psychological thrillers match your viewing history.' },
      { title: 'Forrest Gump', year: 1994, genre: 'Drama', director: 'Robert Zemeckis', rating: 8.8, reason: 'Heartwarming dramas fit your profile.' },
      { title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', director: 'Frank Darabont', rating: 9.3, reason: 'Critically acclaimed drama — a must-watch.' },
      { title: 'Gladiator', year: 2000, genre: 'Action', director: 'Ridley Scott', rating: 8.5, reason: 'Epic historical action aligns with your interests.' },
      { title: 'The Godfather', year: 1972, genre: 'Crime', director: 'Francis Ford Coppola', rating: 9.2, reason: 'Classic cinema — essential for your collection.' }
    ];
    const userGenres = new Set(userMovies.map(m => m.genre));
    const userDirectors = new Set(userMovies.map(m => m.director));
    let scored = allMovies.map(m => {
      let score = 0;
      if (userGenres.has(m.genre)) score += 3;
      if (userDirectors.has(m.director)) score += 2;
      score += (m.rating - 5) / 5;
      const userFavs = user.profile?.favoriteGenres || [];
      if (userFavs.includes(m.genre)) score += 2;
      return { ...m, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 5);
  },

  renderRecommendationCard(rec) {
    return `
      <div class="recommendation-card">
        <h3>${rec.title} (${rec.year})</h3>
        <div class="meta">${rec.genre} &middot; Directed by ${rec.director} &middot; ${rec.rating}/10</div>
        <div class="reason">AI says: ${rec.reason}</div>
        <div class="mt-3">
          <a href="add-movie.html" class="btn btn-primary">Add to Watchlist</a>
        </div>
      </div>
    `;
  }
};
