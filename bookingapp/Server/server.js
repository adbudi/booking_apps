//import module
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
//conection to MongoDB
const connectDB = require("./database/db");

//import router
const categoryRouter = require("./router/categoryRouter");
const bankRouter = require("./router/bankRouter");
const itemRouter = require("./router/itemRouter");
const featureRouter = require("./router/featureRouter");
const infoRouter = require("./router/infoRouter");

connectDB();

//seting cors and morgan
app.use(cors());
app.use(logger("dev"));
//setup postjson
app.use(express.json());
//setup post urlencoded
app.use(express.urlencoded({ extended: false }));

//Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, authorization, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
//setup public url for file
app.use(express.static(path.join(__dirname, "public")));

//url
app.use("/api/category", categoryRouter);
app.use("/api/bank", bankRouter);
app.use("/api/item", itemRouter);
app.use("/api/item/feature", featureRouter);
app.use("/api/item/info", infoRouter);

const port = 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
