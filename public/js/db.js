const movieList = document.querySelector("#movie-list");
const form = document.querySelector("#add-movie");
const searchBar = document.querySelector("#search-bar");
const searchGenre = document.querySelector("#search-genre");

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// =============================================
// save data in indexdb
db.enablePersistence().catch(err => {
  if (err.code == "failed-precondition") {
    //probably bec multiple tabs open
    console.log("persistence failed");
  } else if (err.code == "unimplemented") {
    //lack of browser support
    console.log("persistence is not available");
  }
});

// =================================
// real time listener

db.collection("movies")
  .orderBy("title")
  .onSnapshot(snapshot => {
    let changes = snapshot.docChanges();

    changes.forEach(change => {
      if (change.type == "added") {
        createMovie(change.doc);
      } else if (change.type == "removed") {
        let li = movieList.querySelector(`[data-id="${change.doc.id}" ]`);

        movieList.removeChild(li);
      }
    });
  });
// add movie in DB

form.addEventListener("submit", e => {
  console.log(e);
  e.preventDefault();

  db.collection("movies")
    .add({
      title: form.title.value,
      genre: form.genre.value,
      rating: form.rating.value
    })
    // .then(doc => {
    //   createMovie(doc);
    // })
    .catch(err => {
      console.log(err);
    });
  form.title.value = "";
  form.genre.value = "";
  form.rating.value = "";
});

// =============================
// search movies

searchBar.addEventListener("keyup", e => {
  const term = e.target.value.toLowerCase();
  const movies = movieList.querySelectorAll("li");
  Array.from(movies).forEach(movie => {
    const title = movie.firstElementChild.childNodes[0].nodeValue;

    if (title.toLowerCase().includes(term)) {
      movie.style.display = "block";
    } else {
      movie.style.display = "none";
    }
  });
});

// ===============================
// search genre

searchGenre.addEventListener("change", e => {
  const term = e.target.value.toLowerCase();

  const movies = movieList.querySelectorAll("li");
  Array.from(movies).forEach(movie => {
    const genre = movie.children[1].textContent;

    if (genre.toLowerCase().includes(term)) {
      movie.style.display = "block";
    } else {
      movie.style.display = "none";
    }
  });
});
