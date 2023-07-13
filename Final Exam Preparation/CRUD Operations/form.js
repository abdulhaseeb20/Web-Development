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
  database: "weblabfinal",
});

conn.connect(function (err) {
  if (err) throw err;

  console.log("Connection Sucessful");
});

/*app.get("/", function (req, res) {
  res.render("form");
});*/

app.post("/form", function (req, res) {
  var lastname = req.body.lastname;
  var firstname = req.body.firstname;
  var address = req.body.address;
  var email = req.body.email;
  var loanno = req.body.loanno;
  var lender = req.body.lender;
  var loanamount = req.body.loanamount;
  var interestrate = req.body.interestrate;
  var monthlypay = req.body.monthlypay;
  var monthlytax = req.body.monthlytax;

  var sql = `insert into task3(lastname, firstname, address, email, loanno, lender, loanamount, interestrate, monthlypay, monthlytax) values('${lastname}', '${firstname}', '${address}', '${email}', '${loanno}', '${lender}', '${loanamount}', '${interestrate}', '${monthlypay}', '${monthlytax}')`;

  conn.query(sql, function (err, results) {
    if (err) throw err;
 
    res.send("<h1>Data Inserted.</h1>");
  });
});


var server = app.listen(4000, function () {
    console.log("App running on port 4000");
  });