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

	/**
	 * Initiates a search for weather information based on the city entered by the user.
	 * Validates the input, displays a loading indicator, and updates the view with the search results.
	 * Handles errors during the search process and displays appropriate messages.
	 *
	 * @throws {Error} If an error occurs during the search or weather data retrieval.
	 */
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
				this.view.searchStatus.classList.remove('loader');
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
				this.view.searchStatus.classList.remove('loader');
			});
	}

	/**
	 * Updates the view with future weather data for the next 10 hours.
	 *
	 * @param {Object} data - The weather data object.
	 */
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

	/**
	 * Updates the view with the current weather data.
	 *
	 * @param {Object} data - The weather data object.
	 */
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

	/**
	 * Updates the humidity chart with the provided data.
	 *
	 * @param {Object} data - The data object containing hourly weather information.
	 * @param {Object} data.hourly - The hourly weather data.
	 * @param {string[]} data.hourly.time - An array of timestamps in ISO 8601 format.
	 * @param {number[]} data.hourly.relative_humidity_2m - An array of relative humidity values (in percentage) corresponding to the timestamps.
	 */
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

	/**
	 * Converts a WMO (World Meteorological Organization) weather code to a corresponding weather icon filename.
	 *
	 * @param {number} wmoCode - The WMO weather code representing specific weather conditions.
	 * @returns {string} The filename of the weather icon corresponding to the given WMO code.
	 *                   If the WMO code is not recognized, defaults to 'wi-day-sunny-overcast.svg'.
	 */
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
			case 6:
				return 'wi-dust.svg';
			case 7:
				return 'wi-dust.svg';
			case 8:
				return 'wi-dust.svg';
			case 9:
				return 'wi-sandstorm.svg';
			case 10:
				return 'wi-windy.svg';
			case 11:
				return 'wi-windy.svg';
			case 12:
				return 'wi-windy.svg';
			case 13:
				return 'wi-lighting.svg';
			case 14:
				return 'wi-hail.svg';
			case 15:
				return 'wi-hail.svg';
			case 16:
				return 'wi-hail.svg';
			case 17:
				return 'wi-day-lightnin.gsvg';
			case 18:
				return 'wi-strong-wind.svg';
			case 19:
				return 'wi-day-cloudy-gusts.svg';
			case 20:
				return 'wi-hail.svg';
			case 21:
				return 'wi-rain.svg';
			case 22:
				return 'wi-snow.svg';
			case 23:
				return 'wi-rain-mix';
			case 24:
				return 'wi-rain-mix.svg';
			case 25:
				return 'wi-rain.svg';
			case 26:
				return 'wi-snow.svg';
			case 27:
				return 'wi-hail.svg';
			case 28:
				return 'wi-day-fog.svg';
			case 29:
				return 'wi-thunderstorm.svg';
			case 30:
				return 'wi-dust.svg';
			case 31:
				return 'wi-dust.svg';
			case 32:
				return 'wi-dust.svg';
			case 33:
				return 'wi-dust.svg';
			case 34:
				return 'wi-dust.svg';
			case 35:
				return 'wi-dust.svg';
			case 36:
				return 'wi-snow.svg';
			case 37:
				return 'wi-snow-wind';
			case 38:
				return 'wi-snow-wind';
			case 39:
				return 'wi-snow-wind';
			case 40:
				return 'wi-dust.svg';
			case 41:
				return 'wi-dust.svg';
			case 42:
				return 'wi-dust.svg';
			case 43:
				return 'wi-dust.svg';
			case 44:
				return 'wi-dust.svg';
			case 45:
				return 'wi-dust.svg';
			case 46:
				return 'wi-dust.svg';
			case 47:
				return 'wi-dust.svg';
			case 48:
				return 'wi-dust.svg';
			case 49:
				return 'wi-dust.svg';
			case 50:
				return 'wi-hail.svg';
			case 51:
				return 'wi-hail.svg';
			case 52:
				return 'wi-hail.svg';
			case 53:
				return 'wi-hail.svg';
			case 54:
				return 'wi-hail.svg';
			case 55:
				return 'wi-hail.svg';
			case 56:
				return 'wi-hail.svg';
			case 57:
				return 'wi-hail.svg';
			case 58:
				return 'wi-hail.svg';
			case 59:
				return 'wi-hail.svg';
			case 60:
				return 'wi-rain.svg';
			case 61:
				return 'wi-rain.svg';
			case 62:
				return 'wi-rain.svg';
			case 63:
				return 'wi-rain.svg';
			case 64:
				return 'wi-rain.svg';
			case 65:
				return 'wi-rain.svg';
			case 66:
				return 'wi-rain.svg';
			case 67:
				return 'wi-rain.svg';
			case 68:
				return 'wi-rain.svg';
			case 69:
				return 'wi-rain.svg';
			case 70:
				return 'wi-snow.svg';
			case 71:
				return 'wi-snow.svg';
			case 72:
				return 'wi-snow.svg';
			case 73:
				return 'wi-snow.svg';
			case 74:
				return 'wi-snow.svg';
			case 75:
				return 'wi-snow.svg';
			case 76:
				return 'wi-snow.svg';
			case 77:
				return 'wi-snow.svg';
			case 78:
				return 'wi-snow.svg';
			case 79:
				return 'wi-snow.svg';
			case 80:
				return 'wi-rain.svg';
			case 81:
				return 'wi-rain.svg';
			case 82:
				return 'wi-rain.svg';
			case 83:
				return 'wi-rain.svg';
			case 84:
				return 'wi-rain.svg';
			case 85:
				return 'wi-snow.svg';
			case 86:
				return 'wi-snow.svg';
			case 87:
				return 'wi-snow.svg';
			case 88:
				return 'wi-snow.svg';
			case 89:
				return 'wi-hail.svg';
			case 90:
				return 'wi-hail.svg';
			case 91:
				return 'wi-rain.svg';
			case 92:
				return 'wi-rain.svg';
			case 93:
				return 'wi-hail.svg';
			case 94:
				return 'wi-hail.svg';
			case 95:
				return 'wi-thunderstorm.svg';
			case 96:
				return 'wi-thunderstorm.svg';
			case 97:
				return 'wi-thunderstorm.svg';
			case 98:
				return 'wi-thunderstorm.svg';
			case 99:
				return 'wi-thunderstorm.svg';
			case 100:
				return 'wi-thundersrtorm.svg';
			default:
				return 'wi-day-sunny-overcast.svg';
		}
	}
}
