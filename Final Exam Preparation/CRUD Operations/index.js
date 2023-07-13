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
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;

  var sql = `insert into studentdata(name, email, password) values('${name}', '${email}', '${password}')`;

  conn.query(sql, function (err, results) {
    if (err) throw err;
 
    res.send("<h1>Data Inserted.</h1>");
  });
});


app.get("/getdata", function (req, res) {
    var id = req.query.id;
    var sql = `SELECT * FROM studentdata WHERE id=${id}`;
    conn.query(sql, function (err2, results) {
        if (err2) {
            console.error(err2);
            
        } else {
            res.json(results);
        }
    });
});


app.delete("/delete", function (req, res) {
    var id = req.body.id;
  
    var sql = `DELETE FROM studentdata WHERE id = ${id}`;
  
    conn.query(sql, function (err, result) {
      if (err) throw err;
  
      res.send(result);
    });
  });
  
  app.post('/update', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
  
    var sql = "UPDATE studentdata SET name = ?, email = ?, password = ? WHERE id = ?";
    conn.query(sql, [name, email, password, id], function(err, result) {
      if (err) throw err;
      
      res.send(result);
    });
  });
  

var server = app.listen(4000, function () {
  console.log("App running on port 4000");
});
