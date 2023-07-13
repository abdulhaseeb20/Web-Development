var express = require("express");
var bodyparser = require("body-parser");
var mysql = require("mysql");

const multer = require("multer");
const { log } = require("console"); 
const uploadd = multer({dest:"haseeb/"});

var app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json({limit:"50mb"}));


var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "finalexamprep",
    port: 3306
}
);



connection.connect(function (err)
{
    if (err){
        throw err;
    }
    console.log("Connection is created successfully");
}
);

const storage=multer.diskStorage({
    destination: function(req,file,cb)
    {
      return cb(null,"./haseeb");
    },
    filename:function(req,file,cb)
    {
      return cb(null,`${Date.now()}-${file.originalname}`);
    },
});

const upload2=multer({storage});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./haseeb/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage1 });

app.post("/countuser", upload.single("image"), function (req, res) {
  console.log("djndfj");

  res.setHeader('Access-Control-Allow-Origin', '*');

  var image3=req.file.filename;
  console.log(image3); 
  if(image3)
   {
    res.json(image3);
   }
   else{
    console.log("image empty");
   }

});


app.post("/uploadpage", upload2.single("image"), function(req, res) {
  //*use these 4 line of codes whereever you are sending or getting data from ajax/////
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  ///////////////////////////////////////////////////////////////////////////
   
  console.log("jhdjdsf");
  
   var image3=req.file.filename;
   console.log(image3); 
  
   if(image3)
   {
    res.json(image3);
   }
   else{
    console.log("image empty");
   }
     

    // res.redirect("/");
  });


var server = app.listen(5000, function()
{
    console.log("Server started..");
}
);
