var express = require("express");
var app = express();
var cors=require('cors');
app.use(cors());
var mysql = require("mysql");
const bcrypt = require("bcrypt");

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "activity",
});

conn.connect(function (err) {
  if (err) throw err;

  console.log("Connection Sucessful");
});

app.post("/insert", function (req, res) {
  var name = req.body.name;
  var email = req.body.email;
  var phone = req.body.phone;
  var password = req.body.password;
  var address = req.body.address;
  var zip = req.body.zip;
  var location = req.body.location;
  const salt = bcrypt.genSaltSync(10);
  // Hash a password with the salt
  const hash = bcrypt.hashSync(password, salt);
  

  var sql = `insert into data(name,email,phone,password,address,zipcode,location) values('${name}','${email}', '${phone}', '${hash}','${address}','${zip}','${location}')`;

  conn.query(sql, function (err, result) {
    if (err) throw err;
    res.send("<h1>Data Inserted.</h1>");
  });
});

app.post("/getdata", function (req, res) {
  // console.log('done');
  // alert("done");
  var email = req.body.email;
  var passworduser = req.body.password;
  
  var sql = `SELECT name, password FROM data WHERE email='${email}'`;
  conn.query(sql, function (err, result) {
    
    if (err) throw err;
    if(result.length==0)

    {
      res.send('');
    }
    else{

      for( let i=0;i<result.length; i++)
    {
      var password = result[i].password;
      var username = result[i].name;
       const isMatch = bcrypt.compareSync(passworduser,password);
       if (isMatch) {
         console.log('Password is correct!');
         res.send(username);
       } else {
        res.send("PNC");
         console.log('Password is incorrect!');
       }
    }
    }
  });

});
var server = app.listen(4000, function () {
  console.log("App running on port 4000");
});
