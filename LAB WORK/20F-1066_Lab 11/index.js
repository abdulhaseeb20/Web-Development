var express = require("express");

var app = express();
var mysql = require("mysql");

var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine","ejs");

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

app.get("/" ,function(req,res)
{
    res.render("insert");
});
app.post("/insert", function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password= req.body.password;
    var status = 1;
    var code=Math.floor(Math.random()*1000000)+1;
    
    var sql = `insert into lab11(name, email, password, code, status) values ('${name}', '${email}', '${password}', '${code}', '${status}')`;
 
   conn.query(sql, function (err, results) {
     if (err) throw err;
 
     res.render("display");
   });
 
   const nodemailer = require("nodemailer");
   let testAccount = nodemailer.createTestAccount();
   //mail
   const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jess96@ethereal.email',
        pass: 'uGRprNhfjVNdM8jGnn'
    }
});
let info = transporter.sendMail({
    from: '"Welcome to Facebook" <fb@fb.com>', // sender address
    to: "jess96@ethereal.email", // list of receivers
    subject: "Test mail", // Subject line
    text: "This is your random code "+code, // plain text body
    html: "<h1 style='color:red;'>Mail through node mailer</h1>", // html body
  });
});
app.post("/get",function(req,res)
{
var email=req.body.email;
var password=req.body.password;
var code=req.body.code;

var sql=`select email,password,code from lab11 where email='${email}'`;
conn.query(sql, function (err, results) {
    if (err) throw err;
    if (
      results[0] &&
      results[0].email === email &&
      results[0].password === password &&
      results[0].code === code
    ) {
      console.log("Okay");
    } else {
      console.log("Not okay");
    }
    res.send("<h1>Logged In Successful</h1>");
  });
});


var server =app.listen(4000,function(){
  
  console.log("Server running at 4000");
});