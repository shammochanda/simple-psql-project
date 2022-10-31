import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
import pool from "../db.js";
let books;

export default class BooksDAO {
  static async getBooks({
    filters = null, //can pass in a filter
    page = 0,
    booksPerPage = 20,
  } = {}) {
    //Yet to add books per page
    // https://stackoverflow.com/questions/16568/how-to-select-the-nth-row-in-a-sql-database-table
    let query = {};
    let queryString = {};
    let queryList = []
    if (filters) {
      if (filters["title"] === "") {
        queryString["title"] = "title = title AND"
        query["title"] = "title";
      } else {
        queryList.push(filters["title"])
        queryString["title"] = `title = $${queryList.length} AND`;
        query["title"] = filters["title"];
      }
      if (filters["author"] === "") {
        queryString["author"] = "author = author AND"
        query["author"] = "author";
      } else {
        queryList.push(filters["author"])
        queryString["author"] = `author = $${queryList.length} AND`;
        query["author"] = filters["author"];
      }
      if (filters["genre"] === "") {
        queryString["genre"] = "genre = genre"
        query["genre"] = "genre";
      } else {
        queryList.push(filters["genre"])
        queryString["genre"] = `genre = $${queryList.length}`;
        query["genre"] = filters["genre"];
      }
    }
    try {
      const getbook = await pool.query(
        `SELECT * FROM books WHERE ${queryString["title"]} ${queryString["author"]} ${queryString["genre"]}`,
        queryList
      );

      return { booksList: getbook.rows, totalBooks: 0 };
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`
      );
      return { booksList: [], totalBooks: 0 };
    }

    // let cursor;

    // try {
    //   cursor = await books.find(query); //finds the query in restaurants, if this is blank it just returns all restaurants
    // } catch (e) {
    //   console.error(`Unable to issue find command, ${e}`);
    //   return { booksList: [], totalBooks: 0 };
    // }

    // const displayCursor = cursor.limit(booksPerPage).skip(booksPerPage * page); //limit the results, skip to get to page number

    // try {
    //   const booksList = await displayCursor.toArray();
    //   const totalBooks = await books.countDocuments(query); //counts num of docs

    //   return { booksList, totalBooks };
    // } catch (e) {
    //   console.error(
    //     `Unable to convert cursor to array or problem counting documents, ${e}`
    //   );
    //   return { booksList: [], totalBooks: 0 };
    // }
  }

  static async addBook(title, author, genre) {
    try {
      return await pool.query(
        "INSERT INTO books (title, author, genre) VALUES($1, $2, $3) RETURNING *",
        [title, author, genre]
      );
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }
}
