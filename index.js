const movieList = document.querySelector("#movie-list");
const form = document.querySelector("#add-movie");
const searchBar = document.querySelector("#search-bar");
const searchGenre = document.querySelector("#search-genre");

document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// create movie using DOM

const createMovie = doc => {
  const li = document.createElement("li");
  const title = document.createElement("div");
  const genre = document.createElement("span");
  const space = document.createElement("span");
  const rating = document.createElement("span");
  const del = document.createElement("a");
  const delButton = document.createElement("i");

  li.setAttribute("data-id", doc.id);
  title.textContent = capitalize(doc.data().title);
  genre.textContent = capitalize(doc.data().genre);
  space.textContent = " || ";
  rating.textContent =
    doc.data().rating > 1
      ? doc.data().rating + " stars"
      : doc.data().rating + " star";
  delButton.textContent = "delete";

  li.classList.add("collection-item");
  title.classList.add("flow-text");
  genre.classList.add("genre-type");
  del.classList.add(
    "secondary-content",
    "btn",
    "btn-floating",
    "waves-effect",
    "delete-button"
  );
  delButton.classList.add("material-icons");

  li.appendChild(title);
  li.appendChild(genre);
  li.appendChild(space);
  li.appendChild(rating);
  title.appendChild(del);
  del.appendChild(delButton);

  movieList.appendChild(li);

  del.addEventListener("click", e => {
    let id = doc.id;

    db.collection("movies")
      .doc(id)
      .delete();
  });
};

// =============================================

// add movie in DB

form.addEventListener("submit", e => {
  e.preventDefault();

  db.collection("movies")
    .add({
      title: form.title.value,
      genre: form.genre.value,
      rating: form.rating.value
    })
    .then(doc => {
      createMovie(doc);
    })
    .catch(err => {
      console.log(err);
    });
  form.title.value = "";
  form.genre.value = "";
  form.rating.value = "";
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
