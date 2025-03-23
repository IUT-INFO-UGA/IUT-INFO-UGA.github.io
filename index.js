const weatherIcon =
	'https://raw.githubusercontent.com/erikflowers/weather-icons/bb80982bf1f43f2d57f9dd753e7413bf88beb9ed/svg/';

function search() {
	return;
	console.log('search');
	const city = document.getElementById('city').value;
	if (!city) {
		alert('Veuillez entrer une ville.');
		return;
	}

	fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
		.then(response => response.json())
		.then(data => {
			if (data.length === 0) {
				alert('Ville non trouvée.');
				return;
			}
			boundingBox = data[0].boundingbox;
			document.getElementById(
				'map'
			).src = `https://www.openstreetmap.org/export/embed.html?bbox=${boundingBox[2]},${boundingBox[0]},${boundingBox[3]},${boundingBox[1]}&layer=mapnik`;

			document.querySelector('.information > div:nth-child(2) > div:nth-child(1)').textContent =
				data[0].display_name.split(',')[0];

			// Ajouter la ville dans l'historique
			// addToSearchHistory(data[0].display_name.split(',')[0]);

			// calculateWeather(data[0].lon, data[0].lat);
		});
}

function addToSearchHistory(cityName) {
	// Récupérer l'historique actuel
	const searchHistory = JSON.parse(window.localStorage.getItem('history')) || [];

	// Vérifier si la ville existe déjà dans l'historique
	const cityExists = searchHistory.some(history => history.name === cityName);
	if (!cityExists) {
		// Ajouter la nouvelle ville
		searchHistory.push({ name: cityName, favorite: false });

		// Mettre à jour le localStorage
		window.localStorage.setItem('history', JSON.stringify(searchHistory));

		// Reconstruire la liste des éléments récents
		constructSearchHistory();
	}
}

function calculateWeather(lon, lat) {
	fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,relative_humidity_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Europe%2FLondon&forecast_days=2`
	)
		.then(response => response.json())
		.then(data => {
			if (data.length === 0) {
				alert('Ville non trouvée.');
				return;
			}
			currentWeather(data);
			humidityChart(data);
		});
}

function currentWeather(data) {
	return;
	if (
		!data.current ||
		typeof data.current.relative_humidity_2m != 'number' ||
		typeof data.current.temperature_2m != 'number' ||
		typeof data.current.wind_speed_10m != 'number'
	) {
		alert('données manquante');
		return;
	}
	const urlImg = weatherIcon + weatherCodeToIcon(data.hourly.weather_code);

	const img = document.querySelector('.information > img');
	img.setAttribute('alt', 'weather code ' + data.current.weather_code);
	img.setAttribute('src', urlImg);
	document.querySelector('.information > div:nth-child(3) > div:nth-child(1)').textContent =
		data.current.temperature_2m + '°';
	document.querySelector('.information > div:nth-child(4) > div:nth-child(1)').textContent =
		data.current.relative_humidity_2m + '%';
	document.querySelector('.information > div:nth-child(5) > div:nth-child(1)').textContent =
		data.current.wind_speed_10m + 'km/h';
}

function humidityChart(data) {
	const ctx = document.getElementById('myChart');

	new Chart(ctx, {
		type: 'bar',
		data: {
			labels: data.hourly.time.map(timestamp => {
				const date = new Date(timestamp);
				return `${date.getFullYear().toString().slice(-2)}-${String(date.getMonth() + 1).padStart(
					2,
					'0'
				)}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(
					date.getMinutes()
				).padStart(2, '0')}`;
			}),
			datasets: [
				{
					label: '% humidité',
					data: data.hourly.relative_humidity_2m,
					borderWidth: 1
				}
			]
		}
	});
}

function weatherCodeToIcon(wmoCode) {
	// WMO code to MfD Weather Codes
	switch (wmoCode) {
		case 0:
			return 'wi-day-sunny.svg';
		case 1:
			return 'wi-day-sunny-overcast.svg';
		case 2:
			return 'wi-day-sunny.svg';
		case 3:
			return 'wi-day-sunny-overcast.svg';
		case 4:
			return 'wi-day-light-wind.svg';
		case 5:
			return 'wi-day-haze.svg';
		case 17:
			return 'Blizzard';
		default:
			//the overcast sky is the weather when we don't know in the end
			return 'wi-day-sunny-overcast.svg';
	}
}
