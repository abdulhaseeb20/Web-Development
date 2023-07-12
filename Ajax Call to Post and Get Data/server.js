var express = require("express");
var cors = require("cors");
const bcrypt = require("bcrypt");
var mysql = require("mysql");
var bodyParser = require("body-parser");

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
const salt = bcrypt.genSaltSync(10);// Generate a salt for hashing

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "haseeb",
  port: "3306",
});

conn.connect(function (err) {
  if (err) throw err;

  console.log("Connection Sucessful");
});


app.post("/display", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var hash = bcrypt.hashSync(password, salt);

  var sql = `insert into studentdata(name, email, password) values('${name},', '${email}', '${hash}')`;

  conn.query(sql, function (err, results) {
    if (err) throw err;
 
    res.send("<h1>Data Inserted.</h1>");
  });

  app.get("/getdata", function (req, res) {
    var name = req.query.name;
    var sql = `SELECT * FROM studentdata WHERE name=${name}`;
    conn.query(sql, function (err2, results) {
      const isMatch = bcrypt.compareSync(results, hash);
      console.log(isMatch);
        if (err2) {
            console.error(err2);
            
        } else {
            res.json(results);
        }
    });
  });
});




function generateSession()
{
  
}

var server = app.listen(4000, function(err){
    if(err) throw err;
    console.log("Port 4000");
});