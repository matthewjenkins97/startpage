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
  // first we check for if it's bad weather
  // we do this by checking weather is a bad weather by OpenWeatherMap's ID.
  const badWeather =
    [200, 201, 202, 210, 211, 212, 221, 230, 231, 232, // thunderstorms
      300, 301, 302, 310, 311, 312, 313, 314, 321, // drizzle
      500, 501, 502, 503, 504, 511, 520, 521, 522, 531, // rain
      600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622, // snow
      701, 711, 721, 731, 741, 751, 761, 762, 771, 781, // atmosphere
    ].includes(weatherData.current.weather[0].id);

  // after that, we check if windchill <= 65
  // washington post has a nice article as to why 65 is a good threshold:
  // https://www.washingtonpost.com/weather/2018/10/30/weather-is-what-you-wear-unpacking-clothing-connected-different-climate-conditions-united-states/
  const windchill = weatherData.current.feels_like < 65;

  const DINAJ = (windchill || badWeather) ?
  'You should bring a jacket with you, ' :
  'You should leave your jacket at home, ';

  // now we set the 'weather' tag to a sentence.
  document.getElementById('weather').innerHTML =
  'In ' + townName + ', it is currently ' +
  Math.round(weatherData.current.temp) + '°. ' +
  weatherData.current.weather[0].main + '. ' + DINAJ;
};

main();
