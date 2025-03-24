export default class RequestView {
	constructor() {
		this.city = document.getElementById('city');
		this.chart = document.getElementById('myChart');
		this.unit = document.querySelector('.switch');
		this.searchStatus = document.getElementById('searchStatus');
	}

	/**
	 * charging map
	 * @param {*} boundingBox array of city border position
	 * @param {*} cityname name of city
	 */
	setSearchElement(boundingBox, cityname) {
		document.getElementById(
			'map'
		).src = `https://www.openstreetmap.org/export/embed.html?bbox=${boundingBox[2]},${boundingBox[0]},${boundingBox[3]},${boundingBox[1]}&layer=mapnik`;

		document.querySelector('.information > div:nth-child(2) > div:nth-child(1)').textContent = cityname;
	}

	/**
	 * Updates the weather information for a specific future weather element.
	 *
	 * @param {number} elNumber - The index of the future weather element to update.
	 * @param {string} hours - The time or hours to display for the weather forecast.
	 * @param {string} imgAlt - The alt text for the weather icon image.
	 * @param {string} urlImg - The URL of the weather icon image.
	 * @param {string} temperature - The temperature to display for the weather forecast.
	 */
	setFutreWeatherElement(elNumber, hours, imgAlt, urlImg, temperature) {
		document.querySelector(`.futreWeather > div:nth-child(${elNumber}) > div:nth-child(1)`).textContent = hours;
		const img = document.querySelector(`.futreWeather > div:nth-child(${elNumber}) > img`);
		img.setAttribute('alt', imgAlt);
		img.setAttribute('src', urlImg);
		document.querySelector(`.futreWeather > div:nth-child(${elNumber}) > div:nth-child(3)`).textContent =
			temperature;
	}

	/**
	 * Updates the current weather information displayed on the webpage.
	 *
	 * @param {string} temperature - The temperature to display.
	 * @param {string} humidity - The humidity level to display.
	 * @param {string} windSpeed - The wind speed to display.
	 * @param {string} imgAlt - The alt text for the weather image.
	 * @param {string} imgUrl - The URL of the weather image.
	 */
	setCurrentWeatherElement(temperature, humidity, windSpeed, imgAlt, imgUrl) {
		document.querySelector('.information > div:nth-child(3) > div:nth-child(1)').textContent = temperature;
		document.querySelector('.information > div:nth-child(4) > div:nth-child(1)').textContent = humidity;
		document.querySelector('.information > div:nth-child(5) > div:nth-child(1)').textContent = windSpeed;
		const img = document.querySelector('.information > img');
		img.setAttribute('alt', imgAlt);
		img.setAttribute('src', imgUrl);
	}

	/**
	 * Sets up and renders a bar chart using the provided labels and dataset.
	 *
	 * @param {string[]} label - An array of labels for the x-axis of the chart.
	 * @param {number[]} dataSet - An array of numerical values representing the data points for the chart.
	 */
	setChart(label, dataSet) {
		console.log(this.chart);
		new Chart(this.chart, {
			type: 'bar',
			data: {
				labels: label,
				datasets: [
					{
						label: '% humidité',
						data: dataSet,
						borderWidth: 1
					}
				]
			}
		});
	}
}
