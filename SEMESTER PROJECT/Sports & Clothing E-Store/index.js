const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
var mysql = require("mysql");
const { count } = require("console");
var nodemailer = require("nodemailer");
const multer = require('multer');
const otplib = require('otplib');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json({ limit: "50mb" }));

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ecommercestore",
  });
  
  conn.connect(function (err) {
    if (err) throw err;
  
    console.log("Connection Sucessful");
  });


  //for register customer page
  app.post("/registercustomer", async function (req, res) {
    var name = req.body.customername;
    var username = req.body.username;
    var email = req.body.useremail;
    var password = req.body.userpassword;
    var mobileno = req.body.usermobileno;
    var address = req.body.useraddress;
    var country = req.body.country;
  
    var sql = `insert into registercustomer(customer_username, customer_name,customer_email,customer_pass,customer_mobile,customer_address, customer_country ) values( '${username}', '${name}','${email}','${password}','${mobileno}','${address}','${country}')`;
  
    conn.query(sql, async function (err, results) {
      if (err) throw err;
  
      res.send("<h1>Data Inserted.</h1>");
  
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'buddy.hodkiewicz@ethereal.email',
            pass: 'ERE1TYhnhXzZyzRbYp'
          }
        });
  
        let info = await transporter.sendMail({
          from: '"Welcome to Sport & Clothing" <fb@fb.com>', // sender address
          to: email, // change the recipient to the dynamic email
          subject: "Welcome Message", // Subject line
          text: "Thank you for becoming our member", // plain text body
          html: "<h3 style='color:red;'>Mail through node mailer </h3>", // html body
        });
  
        console.log("Message sent: %s", info.messageId);
      } catch (error) {
        console.log("Error occurred while sending email: ", error);
      }
    });
  });
  

  //for register store page
  app.post("/registerstore", function (req, res) {
    var name = req.body.sname;
    var storename = req.body.storename;
    var email = req.body.email;
    var password = req.body.password;
    var mobileno = req.body.mobileno;
    var address = req.body.address;
    var storetype = req.body.storetype;
  
    var sql = `insert into registerstore(name, storename, email, password, mobileno, address, storetype) values( '${name}', '${storename}','${email}','${password}','${mobileno}','${address}','${storetype}')`;
  
    conn.query(sql, function (err, results) {
      if (err) throw err;
  
      res.send("<h1>Data Inserted.</h1>");
    });
  });

 app.get("/getcustomerdata", function (req, res) {
    var email = req.query.customeremail;
    var password = req.query.customerpassword;
  
    var sql = `select * from registercustomer where customer_email = '${email}'`;
  
    conn.query(sql, function (err, results) {
      if (err) throw err;
  
      if(results[0].password===password)
      {
        res.json(results);
      }
      else
      {
        res.json("Incorrect Password");
      }
    });
  });
  const otpSecrets = new Map();

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via email
async function sendOTPEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'buddy.hodkiewicz@ethereal.email',
        pass: 'ERE1TYhnhXzZyzRbYp'
      }
    });

    const info = await transporter.sendMail({
      from: '"Welcome to Sport & Clothing" <fb@fb.com>',
      to: email,
      subject: 'OTP for Login',
      text: 'Your OTP: ' + otp,
      html: `<h3 style='color:red;'>Your OTP: ${otp}</h3>`
    });

    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
var savedOtp;
// Express route for sending OTP
app.post('/sendotp', function (req, res) {
  var email = req.body.email;
  var otp = generateOTP();
  otpSecrets.set(email, otp);
  savedOtp=otp;
  console.log(savedOtp);
  sendOTPEmail(email, otp)
    .then(() => {
      res.json({ success: true, message: 'OTP sent successfully' });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    });
});

// Express route for OTP verification and login
app.get('/getstoredata', function (req, res) {
  var email = req.query.storeemail;
  var password = req.query.storepassword;
  var otp = req.query.storeotp; // Updated to retrieve from query parameters
  var saved = otpSecrets.get(email);
  var sql = `SELECT * FROM registerstore WHERE email = '${email}'`;
  
  conn.query(sql, function (err, results) {
    if (err) throw err;

    if (results[0].password === password) {
      console.log("OTP: " + otp + " Saved: " + saved);
      if (saved === otp) {
        console.log("OTP verification successful");
        res.json(results);
      } else {
        console.log("Invalid OTP");
        res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
    } else {
      console.log("Incorrect Password");
      res.json("Incorrect Password");
    }
  });
});

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads'); // Specify the directory to store the uploaded files
    },
    filename: function(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // Use the original filename
    },
  });
  
  // Create a Multer instance with the storage configuration
  const upload = multer({ storage: storage });

  
  app.post('/addproduct', upload.single('productPicture'), function(req, res) {
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var productMadeFor = req.body.productMadeFor;
    var productCategory = req.body.productCategory;
    var productType = req.body.productType;
    var productPrice = req.body.productPrice;
    var productQuantity = req.body.productQuantity;
    var productPicture = req.file.filename; // Access the file buffer provided by Multer
  
    // Insert the form data into the database, including the picture data
    var sql = `INSERT INTO storeproducts (name, description, madefor, category, type, price, quantity, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    var values = [
      productName,
      productDescription,
      productMadeFor,
      productCategory,
      productType,
      productPrice,
      productQuantity,
      productPicture
    ];
  
    console.log(values);
    conn.query(sql, values, function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error occurred while adding the product.' });
      } else {
        console.log('Product added successfully!');
        res.json({ success: true, message: 'Product added successfully!' });
      }
    });
  });
  

  app.get('/getmenproducts', (req, res) => {
    // Execute the SQL query to retrieve all products
    const query = "SELECT * FROM storeproducts WHERE madefor = 'men'";
    conn.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });

  app.get('/getwomenproducts', (req, res) => {
    // Execute the SQL query to retrieve all products
    const query = "SELECT * FROM storeproducts WHERE madefor = 'women'";
    conn.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });

  app.get('/getkidsproducts', (req, res) => {
    // Execute the SQL query to retrieve all products
    const query = "SELECT * FROM storeproducts WHERE madefor = 'kids'";
    conn.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  app.get('/getstoreproducts', (req, res) => {
    // Execute the SQL query to retrieve all products
    const query = "SELECT * FROM storeproducts";
    conn.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  app.get('/getsportsproducts', (req, res) => {
    // Execute the SQL query to retrieve all products
    const query = "SELECT * FROM storeproducts WHERE category = 'sports'";
    conn.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  app.get('/getcricketproducts', (req, res) => {
    // Execute the SQL query to retrieve all products
    const query = "SELECT * FROM storeproducts WHERE type = 'cricket'";
    conn.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });
  app.get('/getfootballproducts', (req, res) => {
    // Execute the SQL query to retrieve all products
    const query = "SELECT * FROM storeproducts WHERE type = 'football'";
    conn.query(query, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        res.json(results);
      }
    });
  });

  app.delete('/deleteproduct', function(req, res) {
  var productId = req.body.id;

  // Delete the product from the database using the provided product ID
  var sql = 'DELETE FROM storeproducts WHERE id = ?';
  conn.query(sql, [productId], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Product deleted successfully!');
      res.sendStatus(200);
    }
  });
});


  app.listen(4000, ()=>{
    console.log("Server started on port 4000")
  });

 
  