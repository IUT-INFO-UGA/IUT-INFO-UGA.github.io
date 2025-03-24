import RequestModels from '../models/models-request.mjs';
import SearchHistoryModel from '../models/models-SearchHistory.mjs';
import RequestView from '../view/view-request.mjs';
import SearchHistoryView from '../view/view-SearchHistory.mjs';
import SearchHistoryController from './controller-searchHistory.mjs';

export default class RequestControler {
	constructor() {
		this.weatherIcon =
			'https://raw.githubusercontent.com/erikflowers/weather-icons/bb80982bf1f43f2d57f9dd753e7413bf88beb9ed/svg/';

		this.view = new RequestView();
		this.model = new RequestModels();
		this.searchHistory = new SearchHistoryController(new SearchHistoryModel(), new SearchHistoryView());
		this.view.unit.addEventListener('click', event => {
			if (event.target.checked) {
				this.model.setUnit('fahrenheit');
				//and refresh data warning if you change the city you beak alls
				this.search();
			} else {
				this.model.setUnit('celsius');
				//and refresh data warning if you change the city you beak alls
				this.search();
			}
		});
	}

	search() {
		const city = this.view.city.value;
		if (!city) {
			alert('Veuillez entrer une ville.');
			return;
		}
		this.view.searchStatus.classList.add('loader');
		this.model
			.search(city)
			.then(([boundingBox, name, lon, lat]) => {
				this.view.setSearchElement(boundingBox, name);
				this.searchHistory.addItemToList(name, false);

				this.model.calculateWeather(lon, lat).then(weatherData => {
					if (!weatherData) return;
					this.addFutureWeatherToView(weatherData);
					this.addCurrentWeatherToView(weatherData);
					this.humidityChart(weatherData);
					this.view.searchStatus.classList.remove('loader');
				});
			})
			.catch(error => {
				console.error('Erreur lors de la recherche:', error);
				alert('Une erreur est survenue lors de la recherche.');
				this.view.searchStatus.classList.remove('loader');
			});
	}

	addFutureWeatherToView(data) {
		const offsetTime = new Date().getHours();
		for (let i = 1; i <= 10; i++) {
			const urlImg = this.weatherIcon + this.weatherCodeToIcon(data.hourly.weather_code[i + offsetTime]);
			this.view.setFutreWeatherElement(
				i,
				new Date(data.hourly.time[i + offsetTime]).getHours() + ' h',
				'weather code ' + data.hourly.weather_code[i + offsetTime],
				urlImg,
				data.hourly.temperature_2m[i + offsetTime] + '°'
			);
		}
	}

	addCurrentWeatherToView(data) {
		const urlImg = this.weatherIcon + this.weatherCodeToIcon(data.hourly.weather_code);

		this.view.setCurrentWeatherElement(
			data.current.temperature_2m + '°',
			data.current.relative_humidity_2m + '%',
			data.current.wind_speed_10m + 'km/h',
			'weather code ' + data.current.weather_code,
			urlImg
		);
	}

	humidityChart(data) {
		this.view.setChart(
			data.hourly.time.map(timestamp => {
				const date = new Date(timestamp);
				const year = date.getFullYear().toString().slice(-2);
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');

				return `${year}-${month}-${day} ${hours}:${minutes}`;
			}),
			data.hourly.relative_humidity_2m
		);
	}

	weatherCodeToIcon(wmoCode) {
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
}
