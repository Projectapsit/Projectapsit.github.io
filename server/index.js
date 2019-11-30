const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
const config = require("config");
var mongodb =
  "mongodb+srv://headstrait_1:headstrait_1@cluster0-lxitk.mongodb.net/stockbazaar";
mongoose.connect(mongodb);
const app = express();
const users = require("./routes/api/Users");
const download = require("./routes/api/Download");
const home = require("./routes/api/Home");
const company = require("./routes/api/Stocks");
const companydetails = require("./routes/api/CompanyDetail");
const navbar = require("./routes/api/Navbar"); // Harshal
const upload = require("./routes/api/UploadData"); // Harshal

const indexProfile = require("./routes/api/IndicesProfile");
const screener = require("./routes/api/ScreenerSearch");

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//Bhavana
app.use("/api/users/", users);
app.use("/api/indicesprofile/", indexProfile);

//piyush
app.use("/api/home/", home);
app.use("/api/download", download);

//Nikhil
app.use("/api/companydetail/", companydetails);
app.use("/api/analysis/", companydetails);
app.use("/api/", companydetails);
app.use("/api/screener/", screener); //screener

app.use("/api/sector/", company);

//harshal
app.use("/api/navbar/", navbar);
app.use("/api/upload/", upload);

const port = process.env.PORT || 2001;

if (process.env.NODE_ENV !== "test")
  app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;
