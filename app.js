// jshint esversion:6

const express = require("express");
const https = require("https");
const app = express();

const bodyParser = require("body-parser");

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const query = req.body.city;
    const apiKey = "cecd70becb8849fde33f1772fa062661";
    const units = req.body.units;

    const url =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        query +
        "&appid=" +
        apiKey +
        "&units=" +
        units;

    https.get(url, function(response) {
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);

            const location = weatherData.name;
            const temp = Math.round(weatherData.main.temp);
            const description = weatherData.weather[0].description;
            const icon =
                "http://openweathermap.org/img/wn/" +
                weatherData.weather[0].icon +
                "@2x.png";
            var unitName = "Celcius";

            if (units == "imperial") {
                unitName = "Fahrenheit";
            }

            res.write("<p>Weather Description: " + description + " </p>");
            res.write("<h1>Location: " + location + "</h1>");
            res.write("<h1>Temperature: " + temp + " Degrees " + unitName + "</h1>");
            res.write("<img src=" + icon + " >");
            res.send();
        });
    });
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running");
});