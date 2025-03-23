export default class RequestView {
	constructor() {
		this.city = document.getElementById('city');
	}

	setSearchElement(boundingBox, cityname) {
		document.getElementById(
			'map'
		).src = `https://www.openstreetmap.org/export/embed.html?bbox=${boundingBox[2]},${boundingBox[0]},${boundingBox[3]},${boundingBox[1]}&layer=mapnik`;

		document.querySelector('.information > div:nth-child(2) > div:nth-child(1)').textContent = cityname;
	}

	setFutreWeatherElement(elNumber, hours, imgAlt, urlImg, temperature) {
		document.querySelector(`.futreWeather > div:nth-child(${elNumber}) > div:nth-child(1)`).textContent = hours;
		const img = document.querySelector(`.futreWeather > div:nth-child(${elNumber}) > img`);
		img.setAttribute('alt', imgAlt);
		img.setAttribute('src', urlImg);
		document.querySelector(`.futreWeather > div:nth-child(${elNumber}) > div:nth-child(3)`).textContent =
			temperature;
	}

	setCurrentWeatherElement(temperature, humidity, windSpeed, imgAlt, imgUrl) {
		document.querySelector('.information > div:nth-child(3) > div:nth-child(1)').textContent = temperature;
		document.querySelector('.information > div:nth-child(4) > div:nth-child(1)').textContent = humidity;
		document.querySelector('.information > div:nth-child(5) > div:nth-child(1)').textContent = windSpeed;
		const img = document.querySelector('.information > img');
		img.setAttribute('alt', imgAlt);
		img.setAttribute('src', urlImg);
	}
}
