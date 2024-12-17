if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js').then(() => {
      console.log('Service Worker Registered');
    });
  });
}

const apiKey = 'dad146db';

function searchMovie() {
  const movieTitle = document.getElementById('movieTitle').value;
  const movieInfo = document.getElementById('movieInfo');

  if (movieTitle.trim() === '') {
    movieInfo.innerHTML = '<p>Please enter a movie title.</p>';
    return;
  }

  fetch(
    `http://www.omdbapi.com/?t=${encodeURIComponent(
      movieTitle
    )}&apikey=${apiKey}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.Response === 'True') {
        const runtime = convertRuntime(data.Runtime);
        movieInfo.innerHTML = `
                    <div class="movie-details">
                        <div class="movie-poster">
                            <img src="${data.Poster}" alt="${data.Title} Poster">
                        </div>
                        <div class="movie-text">
                            <h2>${data.Title} (${data.Year})</h2>
                            <p><strong>Director:</strong> ${data.Director}</p>
                            <p><strong>Actors:</strong> ${data.Actors}</p>
                            <p><strong>Runtime:</strong> ${runtime}</p>
                            <p><strong>Plot:</strong> ${data.Plot}</p>
                            <p><strong>IMDb Rating:</strong> ${data.imdbRating}</p>
                        </div>
                    </div>
                `;
      } else {
        movieInfo.innerHTML =
          '<p>Movie not found. Please try another title.</p>';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      movieInfo.innerHTML =
        '<p>An error occurred while fetching movie information. Please try again later.</p>';
    });
}

function convertRuntime(runtimeString) {
  // Extract the number of minutes from the string
  const minutes = parseInt(runtimeString);
  if (isNaN(minutes)) {
    return 'Runtime not available';
  }

  // Convert to hours and minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  // Construct the runtime string
  let runtimeFormatted = '';
  if (hours > 0) {
    runtimeFormatted += `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (remainingMinutes > 0) {
    if (runtimeFormatted !== '') {
      runtimeFormatted += ' ';
    }
    runtimeFormatted += `${remainingMinutes} minute${
      remainingMinutes > 1 ? 's' : ''
    }`;
  }

  return runtimeFormatted || 'Less than a minute';
}
