document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll("select");
  var instances = M.FormSelect.init(elems);
});

const movieList = document.querySelector("#movie-list");
const form = document.querySelector("#add-movie");
const searchBar = document.querySelector("#search-bar");
const searchGenre = document.querySelector("#search-genre");

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
  const star = document.createElement("i");

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

  delete functionality;

  del.addEventListener("click", e => {
    let id = doc.id;

    db.collection("movies")
      .doc(id)
      .delete();
  });
};
// =============================================
// get document from db but not real time

// db.collection("movies")
//   .orderBy("title")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       createMovie(doc);
//     });
//   });

// =============================================

// add cafe list listener

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
    });
  form.title.value = "";
  form.genre.value = "";
  form.rating.value = "";
});

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

searchBar.addEventListener("keyup", e => {
  const term = e.target.value.toLowerCase();
  const movies = movieList.querySelectorAll("li");
  Array.from(movies).forEach(movie => {
    const title = movie.firstElementChild.textContent;

    if (title.toLowerCase().indexOf(term) != -1) {
      movie.style.display = "block";
    } else {
      movie.style.display = "none";
    }
  });
});

searchGenre.addEventListener("change", e => {
  const term = e.target.value.toLowerCase();

  const movies = movieList.querySelectorAll("li");
  Array.from(movies).forEach(movie => {
    const genre = movie.children[1].textContent;

    if (genre.toLowerCase().indexOf(term) != -1) {
      movie.style.display = "block";
    } else {
      movie.style.display = "none";
    }
  });
});