const axios = require('axios');

const api = axios.create({
  baseURL: 'http://api.openweathermap.org/data/2.5/',
});

const APP_KEY = 'fdf871cedaf3413c6a23230372c30a02';
const UNITS = 'Imperial';
const EXCLUDE = 'minutely,daily';

async function fetchWeather(query){
  try{
    const params = {
      lat: query.lat,
      lon: query.lon,
      appid: APP_KEY,
      exclude: EXCLUDE,
      units: UNITS,
    }
    const response = await api.get('/weather', {
      params
    });
    return response;
  }catch(err){
    throw err;
  }
}

async function fetchWeatherDetail(query){
  try{
    const params = {
      lat: query.lat,
      lon: query.lon,
      appid: APP_KEY,
      exclude: EXCLUDE,
      units: UNITS,
    }
    const response = await api.get('/onecall', {
      params
    });
    return response;
  }catch(err){
    throw err;
  }
}

async function mapListData(d){
  try{
    const q = {
      lat: d.lat,
      lon: d.lon,
      appid: APP_KEY,
      exclude: 'hourly,minutely',
    }
    const response = await fetchWeatherDetail(q);
    const responseData = response.data;
    const current = responseData.current;
    const hourly = responseData.hourly[0] || {};
    const result = {
      pop: hourly.pop * 100,
      weather: current.weather[0],
      district: d.district,
      wind_speed: current.wind_speed,
    }
    return result;
  }catch(err){
    throw err;
  }
}

async function getWeather(req, res, next){
  try{
    const response = await fetchWeather(req.query);
    res.status(200).json({
      status: 200,
      data: response.data
    });
  }catch(err){
    next(err);
  }
}

async function getWeatherList(req,res,next){
  try{
    const list = req.body.list;
    const promises = await Promise.all(list.map(d => mapListData(d)));
    res.status(200).json({
      status: 200,
      data: promises
    });
  }catch(err){
    next(err);
  }
}

async function getWeatherDetail(req, res, next){
  try{
    const response = await fetchWeatherDetail(req.query);
    res.status(200).json({
      status: 200,
      data: response.data
    })
  }catch(err){
    next(err);
  }
}

module.exports = {
  getWeather,
  getWeatherDetail,
  getWeatherList
};