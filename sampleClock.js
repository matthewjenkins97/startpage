function updateClock() {
  /*
  Input: None.
  Output: Returns a nicely formatted string of text to describe the current time
  and date.
  */
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const time = formatAMPM(now);
  const date = [months[now.getMonth()],
    getOrdinal(now.getDate()) + ',', now.getFullYear()].join(' ');

  document.getElementById('time').innerHTML = [date, time].join(' at ');
  setTimeout(updateClock, 500);
}

function getOrdinal(n) {
  /*
    Input: n, a Number.
    Output: the ordinal depending on the current day of the month.

    This was taken from stack overflow, I'm not sure how the logic works.
  */
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatAMPM(date) {
  /*
  Input: date, a Date object.
  Output: String, which formats the date in a nice way and returns it.
  */
  let hours = date.getHours() % 12;
  let minutes = date.getMinutes().toString();
  let seconds = date.getSeconds().toString();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours ? hours : 12; // the hour '0' should be '12'

  minutes = minutes.padStart(2, '0');
  seconds = seconds.padStart(2, '0');

  return hours + ':' + minutes + ':' + seconds + ' ' + ampm;
}

updateClock();
