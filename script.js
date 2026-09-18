(function () {
  "use strict";

  var clock = document.getElementById("clock");
  var dateEl = document.getElementById("date");
  var year = document.getElementById("year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function tick() {
    var now = new Date();
    try {
      if (clock) {
        clock.textContent = new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Europe/London"
        }).format(now);
      }
      if (dateEl) {
        dateEl.textContent = new Intl.DateTimeFormat("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: "Europe/London"
        }).format(now);
      }
    } catch (e) {
      /* Intl unavailable: leave the placeholder text */
    }
  }

  tick();
  setInterval(tick, 30000);
})();
