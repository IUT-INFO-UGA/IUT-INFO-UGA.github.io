const weatherIcon =
	'https://raw.githubusercontent.com/erikflowers/weather-icons/bb80982bf1f43f2d57f9dd753e7413bf88beb9ed/svg/';

function search() {
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
			updatefutreWeather(data[0].lon, data[0].lat);
		});
}

function updatefutreWeather(lon, lat) {
	fetch(
		`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&current=temperature_2m&timezone=Europe%2FLondon&forecast_days=2`
	)
		.then(response => response.json())
		.then(data => {
			if (data.length === 0) {
				alert('Ville non trouvée.');
				return;
			}
			console.log(data.hourly, data.hourly.time.length, data.hourly.temperature_2m.length);
			const offsetTime = new Date().getHours();
			if (
				!data.hourly ||
				!data.hourly.time ||
				!data.hourly.temperature_2m ||
				!data.hourly.weather_code ||
				/* dataset have enough data */
				data.hourly.time.length < offsetTime + 10 ||
				data.hourly.temperature_2m.length < offsetTime + 10 ||
				data.hourly.weather_code.length < offsetTime + 10
			) {
				alert('données manquante');
				return;
			}

			//change for data for futre weather
			for (let i = 1; i <= 10; i++) {
				const urlImg = weatherIcon + weatherCodeToIcon(data.hourly.weather_code[i + offsetTime]);
				document.querySelector(`.futreWeather > div:nth-child(${i}) > div:nth-child(1)`).textContent =
					new Date(data.hourly.time[i + offsetTime]).getHours() + ' h';
				const img = document.querySelector(`.futreWeather > div:nth-child(${i}) > img`);
				img.setAttribute('alt', 'weather code ' + data.hourly.weather_code[i + offsetTime]);
				img.setAttribute('src', urlImg);
				document.querySelector(`.futreWeather > div:nth-child(${i}) > div:nth-child(3)`).textContent =
					data.hourly.temperature_2m[i + offsetTime] + '°';
			}
		});
}

function chartFakeData() {
	const ctx = document.getElementById('myChart');

	new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
			datasets: [
				{
					label: '# of Votes',
					data: [12, 19, 3, 5, 2, 3],
					borderWidth: 1
				}
			]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
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
chartFakeData();
