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
	}

	search() {
		const city = this.view.city.value;
		if (!city) {
			alert('Veuillez entrer une ville.');
			return;
		}

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
				});
			})
			.catch(error => {
				console.error('Erreur lors de la recherche:', error);
				alert('Une erreur est survenue lors de la recherche.');
			});
	}

	addFutureWeatherToView(data) {
		const offsetTime = new Date().getHours();
		for (let i = 1; i <= 10; i++) {
			const urlImg = this.weatherIcon + weatherCodeToIcon(data.hourly.weather_code[i + offsetTime]);
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
		const urlImg = this.weatherIcon + weatherCodeToIcon(data.hourly.weather_code);

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
}
