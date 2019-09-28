const db = firebase.firestore(); // fbConfig file
const auth = firebase.auth();

const movieList = document.querySelector("#movie-list");
const form = document.querySelector("#add-movie");
const searchBar = document.querySelector("#search-bar");
const searchGenre = document.querySelector("#search-genre");
const message = document.querySelector("#message");

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

//check auth status
auth.onAuthStateChanged(user => {
  if (user) {
    setupUI(user);
    // add movie in DB
    message.innerHTML = "";
    form.addEventListener("submit", e => {
      e.preventDefault();

      db.collection("movies")
        .add({
          title: form.title.value,
          genre: form.genre.value,
          rating: form.rating.value
        })

        .catch(err => {
          console.log(err);
        });
      form.title.value = "";
      form.genre.value = "";
      form.rating.value = "";
    });
  } else {
    setupUI();
    message.innerHTML = "Please login to add and delete movies";
  }
});

// signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", e => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;

  // sign up the user & add firestore data
  auth
    .createUserWithEmailAndPassword(email, password)
    //   .then(cred => {
    //   return db.collection('users').doc(cred.user.uid).set({
    //     bio: signupForm['signup-bio'].value
    //   });
    // })
    .then(() => {
      // close the signup modal & reset form
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      // signupForm.querySelector('.error').innerHTML = ''
      // }).catch(err => {
      //   signupForm.querySelector('.error').innerHTML = err.message;
      // });
    });
});

// logout
const logoutButtons = document.querySelectorAll("#logout, #logout2");
logoutButtons.forEach(logout => {
  logout.addEventListener("click", e => {
    console.log("logout");
    e.preventDefault();
    auth.signOut();
  });
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    const modal = document.querySelector("#modal-login");
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    //   loginForm.querySelector('.error').innerHTML = '';
    // }).catch(err => {
    //   loginForm.querySelector('.error').innerHTML = err.message;
    // });
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
