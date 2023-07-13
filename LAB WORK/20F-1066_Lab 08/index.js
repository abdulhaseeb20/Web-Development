var express = require("express");

var app = express();

var mysql = require("mysql");

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo",
});

conn.connect(function (err) {
  if (err) throw err;

  console.log("Connection Sucessful");
});

app.get("", function (req, res) {
  res.render("insert");
});


app.post("insert", function (req, res) {
  var user_id = req.body.user_id;
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  

  var sql = `insert into register(name, email, password,age,date) values('${name},', '${email}', '${password}', '${age}', '${date}')`;

  conn.query(sql, function (err, results) {
    if (err) throw err;

    res.send("<h1>Data Inserted.</h1>");
  });
});

var server = app.listen(4000, function () {
  console.log("App running on port 4000");
});
