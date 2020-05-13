async function dataFetch(link) {
  /*
  Input: Valid link.
  Output: JSON of that linked data.
  */
  const data = await fetch(link);
  return data.json();
}

function getPosition(options) {
  /*
    Input: options for this promise.
    Output: Returns a promise of the navigator.getlocation.getCurrentPosition
    function.
  */
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

async function main() {
  /*
  Input: None.
  Output: Text in the format of:

  'In {Town}, it is currently {temperature}°. {Status}.
  {You should bring a jacket with you. |
  You should leave your jacket at home.}',

  sent to the 'weather' tag in index.html.
  */

  // we start by parsing location data -
  // needed because we need to get the location of the town,
  // as well as for the OpenWeatherMap api
  const position = await getPosition();

  // Getting town name from google maps
  const locLink = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' +
  position.coords.latitude + ',' + position.coords.longitude +
  '&result_type=postal_code&key=AIzaSyBJxuWE2w3dZAB3IsYjjVTsMzI6Asr56u4';

  // Not sure how to not have the API key visible, but here we are.
  const locData = await dataFetch(locLink);
  const townName = locData.results[0].address_components[1].long_name;

  // Then we use the above information to get the weather
  const weatherLink =
  'https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/onecall?lat=' +
  position.coords.latitude + '&lon=' + position.coords.longitude +
  '&units=imperial&appid=ca11bc01901b6f102466843f5831713f';
  // Not sure how to not have the API key visible, but here we are.
  const weatherData = await dataFetch(weatherLink);

  // parsing of useful information - this is for DINAJ emulation
  // first we check for if it's light or heavy bad weather
  // we do this by checking weather is a light or heavy bad weather by 
  // OpenWeatherMap's ID.
  const weatherID = weatherData.current.weather[0].id

  // light means light rain, snow, drizzle, etc.
  const lightPrecipitation = 
  [200, 221, 230, 
  300, 310, 
  500, 520, 531,
  600, 612, 615, 620,
  701, 731].includes(weatherID); 
  // heavy means medium + heavy rain, snow drizzle, etc.
  const heavyPrecipitation = 
  [201, 202, 231, 232, 
  301, 302, 311, 312, 313, 314, 321,
  501, 502, 503, 504, 511, 521, 522,
  601, 602, 611, 613, 616, 621, 622,
  751, 761, 762, 771, 781].includes(weatherID);

  // after that, we check windchill against whatever washington post
  // https://www.washingtonpost.com/weather/2018/10/30/weather-is-what-you-wear-unpacking-clothing-connected-different-climate-conditions-united-states/
  const windchill = weatherData.current.feels_like;

  // let me know how to improve this code in a pull request. 
  // if-else blocks annoy me.
  let DINAJ = '';
  if ((windchill < 25) || heavyPrecipitation) {
    DINAJ = 'You should bring a heavy jacket with you.';
  } 
  else if ((windchill >= 25 && windchill < 45) || lightPrecipitation) {
    DINAJ = 'You should bring a light jacket with you.';
  }
  else if (windchill >= 45 && windchill < 65) {
    DINAJ = 'You should bring a sweater or fleece with you.';
  }
  else if (windchill >= 65) {
    DINAJ = 'You should leave your jacket at home.';
  } 

  // now we set the 'weather' tag to a sentence.
  document.getElementById('weather').innerHTML =
  'In ' + townName + ', it is currently ' +
  Math.round(weatherData.current.temp) + '°. ' +
  weatherData.current.weather[0].main + '. ' + DINAJ;
};

main();
