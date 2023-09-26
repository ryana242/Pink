const express = require("express");
const app = express();
const mysql = require("mysql2");
const auth = require("./Routes/auth");
const home = require("./Routes/home");
const admin = require("./Routes/admin");
const fileUpload = require("express-fileupload");
const cors = require("cors");
var fs = require('fs');

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = require("./models");

app.use(fileUpload());
app.use('/uploads/Evidence', express.static(__dirname + '/uploads/Evidence'));
app.use("/auth", auth);
app.use("/home", home);
app.use("/admin", admin);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

connection.query(
  `CREATE DATABASE IF NOT EXISTS complain_system_database`,
  function (err, results) {
    if (!err) {
      db.sequelize.sync().then(() => {
        app.listen(8000, () => {
          console.log("Connected to 8000");

          const dir = './uploads/Evidence';
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
              recursive: true
            });
          }
          const dir2 = './uploads/NSU IDs';
          if (!fs.existsSync(dir2)) {
            fs.mkdirSync(dir2, {
              recursive: true
            });
          }
        });
        });
    } else {
      console.log("KAAM KORENA");
    }
  }
);
