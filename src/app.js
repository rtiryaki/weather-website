const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const http = require("http");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();
const port = process.env.PORT || 3000;
/* console.log(__dirname);
console.log(__filename);  */

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
app.use(express.static(publicDirectoryPath));

// Setup engine and views folder locations
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath, function (err) {});
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { title: "Weather", name: "Ramazan Tiryaki" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", name: "Ramazan Tiryaki" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    msg: "This is some helpfull page",
    name: "Ramazan Tiryaki",
  });
});
// Getting search query from client for waether route
app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide an address to get weather data",
    });
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(location, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

// Getting search query from client for products route
app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "Please provide a search query",
    });
  }

  res.send({
    products: [],
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    errorMessage: "Help article not found",
    name: "Ramazan Tiryaki",
    title: "404",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    errorMessage: "Page not found",
    name: "Ramazan Tiryaki",
    title: "404",
  });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
