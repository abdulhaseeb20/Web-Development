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
  database: "haseeb",
  port: 3306
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
  var email = req.body.email;
  var password = req.body.password;
  var confirm_pass = req.body.confirm_pass;
  var question = req.body.question;
  var answer = req.body.answer;
  var phone = req.body.phone;
  var gender = req.body.gender;
  var start_date=req.body.start_date;
  var end_date=req.body.end_date;
  var interest=req.body.interest;
  
  var sql = `insert into student(FirstName, LastName, Email, Password, confirm_pass, Question, Answer, Phone, Gender, StartDate, EndDate, Interest) values('${firstname}', '${lastname}', '${email}', '${password}', '${confirm_pass}', '${question}', '${answer}', '${phone}','${gender}', '${start_date}', '${end_date}', '${interest}')`;

  conn.query(sql, function (err, results) {
    if (err) throw err;

    res.send("<h1>Data Inserted.</h1>");
  });
});

var server = app.listen(4001, function () {
  console.log("App running on port 4001");
});
