//materialize
document.addEventListener("DOMContentLoaded", function() {
  //select tab
  const select = document.querySelectorAll("select");
  M.FormSelect.init(select);
  //mobile menu
  const menu = document.querySelectorAll(".sidenav");
  M.Sidenav.init(menu, { edge: "right" });

  // modal
  const modals = document.querySelectorAll(".modal");
  M.Modal.init(modals);
});

const loggedOutLinks = document.querySelectorAll(".logged-out");
const loggedInLinks = document.querySelectorAll(".logged-in");

const setupUI = user => {
  if (user) {
    // toggle user UI elements
    loggedInLinks.forEach(item => (item.style.display = "block"));
    loggedOutLinks.forEach(item => (item.style.display = "none"));
  } else {
    // toggle user elements
    loggedInLinks.forEach(item => (item.style.display = "none"));
    loggedOutLinks.forEach(item => (item.style.display = "block"));
  }
};

// open search bar

const openSearchbar = () => {
  let searchBar = document.getElementById("searchBar");
  searchBar.classList.toggle("hide-on-med-and-down");
};

// open add movie

const openAddMovie = () => {
  let addMovie = document.getElementById("add-movie");
  addMovie.classList.toggle("hide-on-med-and-down");
};

// create movie using DOM

const createMovie = doc => {
  const li = document.createElement("li");
  const title = document.createElement("div");
  const genre = document.createElement("span");
  const rating = document.createElement("span");
  const space = document.createElement("span");
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
    "logged-in",
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
