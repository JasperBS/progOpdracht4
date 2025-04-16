const ctx = document.getElementById('js--chart--1');

if (ctx) {
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['PSP', 'Nintendo Wii', 'SNES', 'XBOX 360', 'GameBoy Advanced', 'PlayStation 5'],
      datasets: [{
        label: '# of Votes',
        data: [3, 5, 9, 1, 7, 2],
        backgroundColor: [
          'red', 'blue', 'yellow', 'green', 'purple', 'orange'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

const buitentemperatuur = document.getElementById("js--actuelebuitentemp");
const weatherImage = document.getElementById("js--weatherImg");
const weatherType = document.getElementById("js--weatherType");

function updateWeatherData() {
  fetch("https://weerlive.nl/api/weerlive_api_v2.php?key=demo&locatie=Amsterdam")
    .then(response => response.json())
    .then(realTempData => {
      const tempData = realTempData.liveweer[0];
      const temperature = tempData.temp;

      buitentemperatuur.innerText = temperature + "°C";
      weatherType.innerText = tempData.samenv;

      if (temperature < 10) {
        weatherImage.src = "./img/cold.png";
      } else {
        weatherImage.src = "./img/warm.png";
      }
    });
}

setInterval(updateWeatherData, 3000);
updateWeatherData();
let stopwatchInterval = null;
let elapsedTime = 0;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const milliseconds = (ms % 1000).toString().padStart(3, '0');
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function updateStopwatchDisplay() {
  const display = document.getElementById("stopwatch");
  display.textContent = formatTime(elapsedTime);
}

document.getElementById("sw-start").addEventListener("click", () => {
  if (stopwatchInterval) return;
  const startTime = Date.now() - elapsedTime;
  stopwatchInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateStopwatchDisplay();
  }, 10); // update elke 10ms voor vloeiende weergave
});

document.getElementById("sw-pause").addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
});

document.getElementById("sw-reset").addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  elapsedTime = 0;
  updateStopwatchDisplay();
});

updateStopwatchDisplay();


async function fetchAndDisplayRandomTypes() {
  const typeCounts = {};
  const promises = [];

  for (let i = 0; i < 10; i++) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const url = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
    promises.push(fetch(url).then(res => res.json()));
  }

  const results = await Promise.all(promises);

  results.forEach(pokemon => {
    pokemon.types.forEach(t => {
      const typeName = t.type.name;
      if (typeCounts[typeName]) {
        typeCounts[typeName]++;
      } else {
        typeCounts[typeName] = 1;
      }
    });
  });

  const labels = Object.keys(typeCounts);
  const data = Object.values(typeCounts);
  const colors = labels.map(type => getColorForType(type));

  const typeChartCtx = document.getElementById('js--barchart--pokemon');

  if (typeChartCtx) {
    new Chart(typeChartCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Aantal Pokémon per type',
          data: data,
          backgroundColor: colors,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 60,
              minRotation: 30
            }
          }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Pokémon Types van 10 Willekeurige Pokémon'
          }
        }
      }
    });
  }
}

function getColorForType(type) {
  const colors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
    shadow: '#3E3E3E',
    unknown: '#68A090'
  };
  return colors[type] || '#000';
}

fetchAndDisplayRandomTypes();

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const timeElement = document.getElementById('time');
  if (timeElement) {
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('nl-NL', options);

  const dateElement = document.getElementById('date');
  if (dateElement) {
    dateElement.textContent = formattedDate;
  }
}

setInterval(updateTime, 1000);
updateTime();
updateDate();
