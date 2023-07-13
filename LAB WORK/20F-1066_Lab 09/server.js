var express = require("express");
var cors = require("cors");

var app = express();

app.use(cors());

var mysql = require("mysql");

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "haseeb",
});

conn.connect(function (err) {
  if (err) throw err;

  console.log("Connection Sucessful");
});

app.get("/", function (req, res) {
  res.render("insert");
});

app.post("/insert", function (req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var gender = req.body.gender;
  var email = req.body.email;
  var phoneno = req.body.phoneno;
  var answer = req.body.answer;

  var sql = `insert into lab9(firstname, lastname, password, cpassword, gender, email, phoneno, answer) values('${firstname},', '${lastname}', '${password}', '${cpassword}', '${gender}', '${email}', '${phoneno}', '${answer}')`;

  conn.query(sql, function (err, results) {
    if (err) throw err;
 
    res.send("<h1>Data Inserted.</h1>");
  });
});


var server = app.listen(8000, function () {
    console.log("App running on port 8000");
  });