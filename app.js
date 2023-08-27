const express = require("express"),
  app = express(),
  mySQL = require("mysql2"),
  port = 3000 | process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();

const connection = mySQL.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.log("DB connection fail " + err.message);
  }
  console.log("DB connection successfully...");
});

// Post method start
app.post("/", (req, res) => {
  console.log(req.body);
  const { id, name, email, password } = req.body;

  connection.query(
    "INSERT INTO users SET ?",
    {
      id: id,
      name: name,
      email: email,
      password: password,
    },
    (err, result) => {
      if (err) {
        res.status(500).json({
          status: "FAIL",
          ERROR: err.message,
        });
      } else {
        res.status(201).json({
          status: "success",
          result: result,
        });
      }
    }
  );
});
// Post method end

// GET method start
app.get("/", (req, res) => {
  connection.query("SELECT * FROM users", (error, result) => {
    if (error) {
      res.status(500).json({
        status: "FAIL",
        ERROR: error.message,
      });
    } else {
      res.status(201).json({
        status: "SUCCESS",
        result: result,
      });
    }
  });
});
// GET method end

// UPDATE METHOD START

app.put("/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;

  const updateQuery = `
    UPDATE users
    SET name = ?
    WHERE id = ?
  `;

  connection.query(updateQuery, [name, id], (err, result) => {
    if (err) {
      res.status(500).json({
        status: "FAIL",
        ERROR: err.message,
      });
    } else {
      res.status(201).json({
        status: "SUCCESS",
        RESULT: result,
      });
    }
  });
});

// UPDATE METHOD END

// delete method start
app.delete("/:id", (req, res) => {
  const id = req.params.id;

  const deleteQuery = `DELETE FROM users WHERE id = ?`;

  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      res.status(500).json({
        status: "FAIL",
        ERROR: err.message,
      });
    } else if (result.affectedRows === 0) {
      res.status(404).json({
        status: "FAIL",
        message: "data not found!",
      });
    } else {
      res.status(200).json({
        status: "SUCCESS",
        result: result,
      });
    }
  });
});
// delete method end

app.listen(port, () => {
  console.log(`server start at port ${port}`);
});
