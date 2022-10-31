import app from "./server.js";
import BooksDAO from "./dao/booksDAO.js";
//gets access to mongo client

//accessing env vars
const port = 5000;

app.listen(port, () => {
  //listen on the port
  console.log(`listening on port ${port}`);
});