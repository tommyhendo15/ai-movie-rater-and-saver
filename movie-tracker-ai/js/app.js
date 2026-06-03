fetch("../data/movies.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("featuredMovies");

    data.slice(0, 3).forEach(movie => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${movie.title}</h3>
        <p>Genre: ${movie.genre}</p>
        <p>Rating: ${movie.rating}/5</p>
      `;
      container.appendChild(div);
    });
  });


fetch("../data/announcements.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("announcements");

    data.forEach(a => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${a.title}</h3>
        <p>${a.message}</p>
        <small>${a.date}</small>
      `;
      container.appendChild(div);
    });
  });