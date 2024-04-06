import http from "./infra/http/server.js";

http
  .start()
  .then(() => console.log("Server it's running..."))
  .catch(console.error);
