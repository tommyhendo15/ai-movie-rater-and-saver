function generateRecommendations() {
  const profile = JSON.parse(localStorage.getItem("extendedProfile"));
  const movies = JSON.parse(localStorage.getItem("movies")) || [];

  const resultsBox = document.getElementById("results");
  resultsBox.innerHTML = "";

  if (!profile) {
    resultsBox.innerHTML = "<p>Please complete your extended profile first.</p>";
    return;
  }

  // Simple AI logic (rule-based recommendations)
  let recommendations = [];

  movies.forEach(movie => {
    let score = 0;

    if (movie.genre === profile.favoriteGenre) score += 3;
    if (movie.genre === profile.secondGenre) score += 2;
    if (movie.rating >= 4) score += 2;

    // boost if Sci-Fi / Action fans (example logic)
    if (
      profile.favoriteGenre === "Sci-Fi" &&
      movie.genre === "Sci-Fi"
    ) score += 2;

    if (score >= 3) {
      recommendations.push(movie);
    }
  });

  // If no matches, fallback suggestions
  if (recommendations.length === 0) {
    resultsBox.innerHTML = "<p>No strong matches found. Try adding more movies or updating your profile.</p>";
    return;
  }

  recommendations.slice(0, 5).forEach(movie => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${movie.title}</h3>
      <p>Genre: ${movie.genre}</p>
      <p>Rating: ${movie.rating}/5</p>
    `;

    resultsBox.appendChild(div);
  });
}