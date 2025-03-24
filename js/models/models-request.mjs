/**
 * Class representing a model for handling requests related to weather and location data.
 */
export default class RequestModels {
	/**
	 * Creates an instance of RequestModels.
	 * Initializes the unit of temperature to 'celsius'.
	 */
	constructor() {
		this.unit = 'celsius';
	}

	/**
	 * Sets the unit of temperature.
	 * @param {string} unit - The unit of temperature (e.g., 'celsius', 'fahrenheit').
	 */
	setUnit(unit) {
		this.unit = unit;
	}

	/**
	 * Searches for a city using the OpenStreetMap Nominatim API.
	 * @param {string} noTrustCityName - The name of the city to search for.
	 * @returns {Promise<Array|null>} A promise that resolves to an array containing the bounding box,
	 *                                city name, longitude, and latitude, or null if the city is not found.
	 */
	search(noTrustCityName) {
		return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${noTrustCityName}`)
			.then(response => response.json())
			.then(data => {
				if (data.length === 0) {
					alert('Ville non trouvée.');
					return null;
				}
				if (
					data &&
					data[0] &&
					Array.isArray(data[0].boundingbox) &&
					data[0].display_name.split(',').length > 0 &&
					data[0].display_name.split(',')[0] != undefined
				) {
					const boundingBox = data[0].boundingbox;
					const name = data[0].display_name.split(',')[0];

					return [boundingBox, name, data[0].lon, data[0].lat];
				} else {
					alert('Données non disponibles.');
					return null;
				}
			});
	}

	/**
	 * Calculates the weather data for a given longitude and latitude using the Open-Meteo API.
	 * @param {string} lon - The longitude of the location.
	 * @param {string} lat - The latitude of the location.
	 * @returns {Promise<Object|null>} A promise that resolves to the weather data object or null if data is missing.
	 */
	calculateWeather(lon, lat) {
		return fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,relative_humidity_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Europe%2FLondon&forecast_days=2&temperature_unit=${this.unit}`
		)
			.then(response => response.json())
			.then(data => {
				const offsetTime = new Date().getHours();
				if (data.length === 0) {
					alert('Ville non trouvée.');
					return null;
				}
				if (
					!data.hourly ||
					!data.hourly.time ||
					!data.hourly.temperature_2m ||
					!data.hourly.weather_code ||
					/* dataset have enough data */
					data.hourly.time.length < offsetTime + 10 ||
					data.hourly.temperature_2m.length < offsetTime + 10 ||
					data.hourly.weather_code.length < offsetTime + 10 ||
					/* current data*/
					!data.current ||
					typeof data.current.relative_humidity_2m != 'number' ||
					typeof data.current.temperature_2m != 'number' ||
					typeof data.current.wind_speed_10m != 'number'
				) {
					alert('données manquante');
					return null;
				}
				return data;
			});
	}
}
