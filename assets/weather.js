(function () {
  const weatherWindow = document.querySelector("#weather");
  const weatherCloseBtn = document.querySelector("#weatherclose");
  const weatherShortcut = document.querySelector("#weathershortcut");

  if (weatherCloseBtn && weatherWindow) {
    weatherCloseBtn.addEventListener("click", function () {
      weatherWindow.style.display = "none";
    });
  }

  if (weatherShortcut && weatherWindow) {
    weatherShortcut.addEventListener("click", function () {
      weatherWindow.style.display = "flex";
      fetchWeatherData(); 
    });
  }

  if (weatherWindow && typeof window.dragElement === "function") {
    window.dragElement(weatherWindow);
  } else if (typeof dragElement === "function") {
    dragElement(weatherWindow);
  }

  function fetchWeatherData() {
    const targetUrl = "https://api.open-meteo.com/v1/forecast?latitude=42.4312&longitude=-83.4833&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_clear_sky_max,sunrise,sunset,daylight_duration,uv_index_max,moonrise,moonset,moon_phase,sunshine_duration,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,snow_depth,visibility,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_gusts_10m,temperature_80m,temperature_120m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_temperature_54cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,cloud_cover,wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&past_days=5";

    fetch(targetUrl)
      .then(response => {
        if (!response.ok) throw new Error("Weather data request failed.");
        return response.json();
      })
      .then(data => {
        document.querySelector("#telemetryLat").innerText = data.latitude;
        document.querySelector("#telemetryLon").innerText = data.longitude;
        document.querySelector("#telemetryElev").innerText = data.elevation;
        document.querySelector("#telemetryGenTime").innerText = data.generationtime_ms.toFixed(2);
        document.querySelector("#telemetryTZ").innerText = `${data.timezone} (${data.timezone_abbreviation})`;

        const current = data.current;
        const curUnits = data.current_units;

        document.querySelector("#current_time").innerText = current.time.replace("T", " ");
        document.querySelector("#current_interval").innerText = current.interval;
        document.querySelector("#weatherTemp").innerText = `${current.temperature_2m}${curUnits.temperature_2m}`;
        document.querySelector("#weatherApparent").innerText = `${current.apparent_temperature}${curUnits.apparent_temperature}`;
        document.querySelector("#weatherHumidity").innerText = `${current.relative_humidity_2m}${curUnits.relative_humidity_2m}`;
        document.querySelector("#current_is_day").innerText = current.is_day === 1 ? "Day" : "Night";
        document.querySelector("#current_cloud_cover").innerText = `${current.cloud_cover}${curUnits.cloud_cover}`;
        document.querySelector("#current_precipitation").innerText = `${current.precipitation}${curUnits.precipitation}`;
        document.querySelector("#current_rain").innerText = `${current.rain}${curUnits.rain}`;
        document.querySelector("#current_showers").innerText = `${current.showers}${curUnits.showers}`;
        document.querySelector("#current_snowfall").innerText = `${current.snowfall}${curUnits.snowfall}`;
        document.querySelector("#current_wind_speed").innerText = `${current.wind_speed_10m} ${curUnits.wind_speed_10m}`;
        document.querySelector("#current_wind_direction").innerText = `${current.wind_direction_10m}${curUnits.wind_direction_10m}`;
        document.querySelector("#current_wind_gusts").innerText = `${current.wind_gusts_10m} ${curUnits.wind_gusts_10m}`;
        document.querySelector("#weatherDesc").innerText = translateWmoCode(current.weather_code || 0);

        const dIdx = data.past_days || 5;
        const daily = data.daily;
        const dUnits = data.daily_units;

        document.querySelector("#daily_time").innerText = daily.time[dIdx];
        document.querySelector("#daily_weather_code").innerText = daily.weather_code[dIdx];
        document.querySelector("#daily_max_temp").innerText = `${daily.temperature_2m_max[dIdx]}${dUnits.temperature_2m_max}`;
        document.querySelector("#daily_min_temp").innerText = `${daily.temperature_2m_min[dIdx]}${dUnits.temperature_2m_min}`;
        document.querySelector("#daily_max_apparent").innerText = `${daily.apparent_temperature_max[dIdx]}${dUnits.apparent_temperature_max}`;
        document.querySelector("#daily_min_apparent").innerText = `${daily.apparent_temperature_min[dIdx]}${dUnits.apparent_temperature_min}`;
        document.querySelector("#weatherSunrise").innerText = formatClockTimestamp(daily.sunrise[dIdx]);
        document.querySelector("#weatherSunset").innerText = formatClockTimestamp(daily.sunset[dIdx]);
        document.querySelector("#daily_moonrise").innerText = formatClockTimestamp(daily.moonrise[dIdx]);
        document.querySelector("#daily_moonset").innerText = formatClockTimestamp(daily.moonset[dIdx]);
        document.querySelector("#daily_moon_phase").innerText = daily.moon_phase[dIdx];
        document.querySelector("#daily_daylight_duration").innerText = formatDuration(daily.daylight_duration[dIdx]);
        document.querySelector("#daily_sunshine_duration").innerText = formatDuration(daily.sunshine_duration[dIdx]);
        document.querySelector("#daily_uv_max").innerText = daily.uv_index_max[dIdx];
        document.querySelector("#daily_uv_clear").innerText = daily.uv_index_clear_sky_max[dIdx];
        document.querySelector("#daily_wind_max").innerText = `${daily.wind_speed_10m_max[dIdx]} ${dUnits.wind_speed_10m_max}`;
        document.querySelector("#daily_wind_dir").innerText = `${daily.wind_direction_10m_dominant[dIdx]}${dUnits.wind_direction_10m_dominant}`;
        document.querySelector("#daily_gust_max").innerText = `${daily.wind_gusts_10m_max[dIdx]} ${dUnits.wind_gusts_10m_max}`;

        const hourly = data.hourly;
        const hUnits = data.hourly_units;
        const curHourString = current.time.substring(0, 14) + "00"; 
        let hIdx = hourly.time.indexOf(curHourString);
        if (hIdx === -1) hIdx = 125; 

        const container = document.querySelector("#hourlyContainer");
        if (container) {
          container.innerHTML = `
            <div style="font-weight:bold; border-bottom: 1px dotted rgba(255,255,255,0.1); padding-bottom:2px; margin-bottom:4px; color:#ff831d;">Time: ${hourly.time[hIdx].replace("T", " ")}</div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:4px 12px; opacity:0.9;">
              <div>Temperature: <span>${hourly.temperature_2m[hIdx]}${hUnits.temperature_2m}</span></div>
              <div>Feels Like: <span>${hourly.apparent_temperature[hIdx]}${hUnits.apparent_temperature}</span></div>
              <div>Relative Humidity: <span>${hourly.relative_humidity_2m[hIdx]}${hUnits.relative_humidity_2m}</span></div>
              <div>Dew Point: <span>${hourly.dew_point_2m[hIdx]}${hUnits.dew_point_2m}</span></div>
              <div>Precipitation Prob: <span>${hourly.precipitation_probability[hIdx]}${hUnits.precipitation_probability}</span></div>
              <div>Precipitation Accum: <span>${hourly.precipitation[hIdx]}${hUnits.precipitation}</span></div>
              <div>Rain Metric: <span>${hourly.rain[hIdx]}${hUnits.rain}</span></div>
              <div>Snowfall: <span>${hourly.snowfall[hIdx]}${hUnits.snowfall}</span></div>
              <div>Snow Depth: <span>${hourly.snow_depth[hIdx]}${hUnits.snow_depth}</span></div>
              <div>Visibility: <span>${hourly.visibility[hIdx]}${hUnits.visibility}</span></div>
              <div>Wind Speed (10m): <span>${hourly.wind_speed_10m[hIdx]} ${hUnits.wind_speed_10m}</span></div>
              <div>Wind Speed (80m): <span>${hourly.wind_speed_80m[hIdx]} ${hUnits.wind_speed_80m}</span></div>
              <div>Wind Speed (120m): <span>${hourly.wind_speed_120m[hIdx]} ${hUnits.wind_speed_120m}</span></div>
              <div>Wind Direction 10m: <span>${hourly.wind_direction_10m[hIdx]}${hUnits.wind_direction_10m}</span></div>
              <div>Wind Direction 80m: <span>${hourly.wind_direction_80m[hIdx]}${hUnits.wind_direction_80m}</span></div>
              <div>Wind Direction 120m: <span>${hourly.wind_direction_120m[hIdx]}${hUnits.wind_direction_120m}</span></div>
              <div>Max Wind Gusts: <span>${hourly.wind_gusts_10m[hIdx]} ${hUnits.wind_gusts_10m}</span></div>
              <div>Temperature (80m): <span>${hourly.temperature_80m[hIdx]}${hUnits.temperature_80m}</span></div>
              <div>Temperature (120m): <span>${hourly.temperature_120m[hIdx]}${hUnits.temperature_120m}</span></div>
              <div>Soil Temperature (0cm): <span>${hourly.soil_temperature_0cm[hIdx]}${hUnits.soil_temperature_0cm}</span></div>
              <div>Soil Temperature (6cm): <span>${hourly.soil_temperature_6cm[hIdx]}${hUnits.soil_temperature_6cm}</span></div>
              <div>Soil Temperature (18cm): <span>${hourly.soil_temperature_18cm[hIdx]}${hUnits.soil_temperature_18cm}</span></div>
              <div>Soil Temperature (54cm): <span>${hourly.soil_temperature_54cm[hIdx]}${hUnits.soil_temperature_54cm}</span></div>
              <div>Soil Moisture (0-1cm): <span>${hourly.soil_moisture_0_to_1cm[hIdx]} ${hUnits.soil_moisture_0_to_1cm}</span></div>
              <div>Soil Moisture (1-3cm): <span>${hourly.soil_moisture_1_to_3cm[hIdx]} ${hUnits.soil_moisture_1_to_3cm}</span></div>
              <div>Soil Moisture (3-9cm): <span>${hourly.soil_moisture_3_to_9cm[hIdx]} ${hUnits.soil_moisture_3_to_9cm}</span></div>
            </div>
          `;
        }
      }) 
      .catch(error => {
        console.error("Error fetching weather data:", error);
        if (document.querySelector("#weatherDesc")) {
          document.querySelector("#weatherDesc").innerText = "Weather data unavailable.";
        }
      });
  } 

  function formatClockTimestamp(isoString) {
    if (!isoString) return "--:--"; 
    const dateObj = new Date(isoString); 
    return dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDuration(totalSeconds) {
    if (!Number.isFinite(totalSeconds)) return "--";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  }

  function translateWmoCode(code) {
    if (code === 0) return "Clear";
    if (code >= 1 && code <= 3) return "Partly cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 65) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Rain showers";
    if (code >= 95) return "Thunderstorms";
    return "Unknown";
  }
})();
