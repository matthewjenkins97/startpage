function updateClock() {
      var now = new Date(),
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      time = formatAMPM(now), 
      date = [months[now.getMonth()],
      getOrdinal(now.getDate()) + ',',
      now.getFullYear()].join(' ');
      document.getElementById('time').innerHTML = [date, time].join(' at ');
      var t = setTimeout(updateClock, 500);
    }
    function getOrdinal(n) {
      var s=["th","st","nd","rd"],
      v=n%100;
      return n+(s[(v-20)%10]||s[v]||s[0]);
    }
    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      seconds = seconds < 10 ? '0'+seconds : seconds;
      var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
      return strTime;
    }
    updateClock();