const request = require("request");

const forecast = (location, callback) => {
  const url =
    "http://api.weatherstack.com/current?query=" +
    location +
    "&access_key=3c9f765bc490ec0d349c013588854fd1&units=m";

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("Unable to connect to weather service!", undefined);
    } else if (body.error) {
      callback("Unable to find location", undefined);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". it is currently " +
          body.current.temperature +
          " degrees outside. There is a " +
          body.current.precip +
          " % chance of rain"
      );
    }
  });
};

module.exports = forecast;
