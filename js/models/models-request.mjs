export default class RequestModels {
	constructor() {}
	search(noTrustCityName) {
		return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${noTrustCityName}`)
			.then(response => response.json())
			.then(data => {
				if (data.length === 0) {
					alert('Ville non trouvée.');
					return;
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
				}
			});
	}

	calculateWeather(lon, lat) {
		return fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,relative_humidity_2m&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Europe%2FLondon&forecast_days=2`
		)
			.then(response => response.json())
			.then(data => {
				const offsetTime = new Date().getHours();
				if (data.length === 0) {
					alert('Ville non trouvée.');
					return;
				}
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
				return data;
			});
	}
}
