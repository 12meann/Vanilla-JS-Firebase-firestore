//check if browser supports service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(reg => console.log("serviceWorker registered"))
    .catch(err => console.log("serviceWorker not registered", err));
}
