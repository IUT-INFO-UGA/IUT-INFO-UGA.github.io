import RequestModels from '../models/models-request.mjs';
import SearchHistoryModel from '../models/models-SearchHistory.mjs';
import RequestView from '../view/view-request.mjs';
import SearchHistoryView from '../view/view-SearchHistory.mjs';
import SearchHistoryController from './controller-searchHistory.mjs';

export default class RequestControler {
	constructor() {
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
			const urlImg = weatherIcon + weatherCodeToIcon(data.hourly.weather_code[i + offsetTime]);
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

		this.view.setCurrentWeatherElement(
			data.current.temperature_2m + '°',
			data.current.relative_humidity_2m + '%',
			data.current.wind_speed_10m + 'km/h',
			'weather code ' + data.current.weather_code,
			urlImg
		);
	}
}
