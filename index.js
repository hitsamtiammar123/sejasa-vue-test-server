const express = require('express');
const cors = require('cors');
const { getWeather, getWeatherDetail, getWeatherList } = require('./pages');

const app = express();

app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/get-weather', getWeather);
app.get('/get-weather-detail', getWeatherDetail);
app.post('/get-weather-list', getWeatherList);

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(400).json({
    message: err.message,
    err
  });
})

app.listen(process.env.PORT || 3025, () => {
  console.log('Server running')
})
