const API_KEY = "a65f0b5a";
const searchForm = document.getElementById('form-control');
const searchTitle = document.getElementById('search-input');
const removeBtn = document.getElementById('remove-movie');
const localStorage =  window.localStorage;
let isFavorite = false;

// Search movies
function searchMovies(e){
  e.preventDefault();
  let val = searchTitle.value;
  fetchSearchApi(val);
  searchForm.reset();
}



// Fetch movies when user type somthing in the browser
function fetchSearchApi(searchTerm) {
  fetch(`https://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${API_KEY}`)
  .then((res) => res.json())
  .then((data) => {
    let items = data.Search;
    renderSearchResultsToDom(items);
  });
}


// Load Default movie when browser gets load
function LoadIntialApi(title) {
  fetch(`https://www.omdbapi.com/?t=${title}&plot=full&page=1&apikey=${API_KEY}`)
  .then((res) => res.json())
  .then((data) => {
    RenderOnToDom(data , '')
  });
}

let DEFAULT_TITLE = 'kabhi khushi kabhie gham';
LoadIntialApi(DEFAULT_TITLE);


// Load favourite moviess
const id = JSON.parse(localStorage.getItem('movie-ids'));
if(id) {
  LoadFavouriteMovie(id);
}
else {
  let fav = document.getElementById('fav-movie-wrapper');
  if(fav){ fav.innerHTML = `<h2>No Favourite Movies found!</h2`}
}




// Load favourite movie
function LoadFavouriteMovie(id){
  fetch(`https://www.omdbapi.com/?i=${id}&plot=full&page=1&apikey=${API_KEY}`)
  .then((res) => res.json())
  .then((data) => { 
    RenderOnToDom(data , 'fav');
  });
}

function RenderOnToDom(data , type) {
  let movieContainer;
  
  let text = '';
  if(type == '') {
    text  = 'Add favourite';
    movieContainer = document.getElementById("movie-wrapper");
  }
  else {
    text = 'remove favourite'
    movieContainer = document.getElementById("fav-movie-wrapper");
  }

 if(movieContainer) {
  movieContainer.innerHTML = `
  <div id="movie-poster">
  <img src=${data.Poster} />
     </div>
     <div id="movie-details">
        <h2 id="title">${data.Title}</h2>
        <p>
        <span><strong>Year: </strong></span>
          <span>${data.Year}</span>${" "}
          <span>${data.Rated}</span>${" "}
          <span>${data.Released}</span>${" "}
          </p>

        <!-- movie Generes -->
        <p id="genre">
          <span>
            <strong>Genere :</strong>
            ${data.Genre}
            </span>
        </p>
        
        
        <!-- movie Writer -->
        <p id="Writer">
          <span>
            <strong>Writer :</strong>
            ${data.Writer}
          </span>
        </p>
        
     
        <!-- movie description -->
        <p id="movie-description">
         <span>
           <strong>Plot: </strong>
            ${data.Plot}
          </span>: 
        </p>
        
        <!-- movie Language -->
        <p id="language">
        <span>
        <strong>Language :</strong>
            ${data.Language}
            </span>
            </p>

      <!-- movie awards -->
      <p id="award">
      <span>
            <strong>Awards :</strong>
            ${data.Awards}
        </span>: 
      </p>
      <div class="add-favorite-btn">
          <button type="button" id="add-favourite" class="remove-movie" movie-id=${data.imdbID}>${text}</button>
       </div>
     </div>
   `;
    
    
   const addFavoriteBtn = document.getElementById('add-favourite');
    AddMovieTofavourite(addFavoriteBtn);
  }

}


// Add movie to favorite
function AddMovieTofavourite(addFavoriteBtn) {
  addFavoriteBtn.addEventListener('click' , function() {
    var IMDB_ID = addFavoriteBtn.getAttribute('movie-id'); 
    if(!isFavorite) {
        // Add movie id to localStorage    
        localStorage.setItem('movie-ids', JSON.stringify(IMDB_ID));
        addFavoriteBtn.setAttribute('class' , 'remove-favourite');
        addFavoriteBtn.innerText = 'Remove from favourite';
        isFavorite = true;
        
        // get movie ids from localStorage
       }
       else {
         addFavoriteBtn.innerText = 'Add favourite';
          localStorage.removeItem('movie-ids');
          isFavorite = false;
          history.go(0);
      }
    });
    
  }
  
  
  
  // Render Searched movies to Dom
  function renderSearchResultsToDom(data) {
  const SearchedMovieList = document.getElementById('search-movie-list');
  data.forEach(item => {
    var li = document.createElement('li');
     li.innerHTML = `
       <div id="${item.imdbID}" class="wrapper movie">
          <div class="avatar">
             <img src=${item.Poster} alt=${item.Title} />
          </div>
          <div class="movie-content">
          <h4>${item.Title}</h4>
          </div>
          </div>
   `;
    SearchedMovieList.prepend(li);
  });
  // callback
  clickToRenderMain();
}

  // click to searched movie to render that movie on main page 
  function clickToRenderMain() {
    const List = document.querySelectorAll('.movie'); 
    List.forEach(movie => {
      let children = movie.children;
      let getTitle = children[1].getElementsByTagName('h4')[0].innerText;
      
      movie.addEventListener('click' , function(e){
        LoadIntialApi(getTitle);
      })
    })
  }
  
  // if we are on the home page 
 searchForm && searchForm.addEventListener('submit', searchMovies);
