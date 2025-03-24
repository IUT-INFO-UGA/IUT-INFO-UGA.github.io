export default class SearchHistoryView {
	constructor(controller) {
		this.controller = controller;
		this.recentItems = document.querySelector('.recent ul');
		this.city = document.getElementById('city');
		//handle click on city name
		this.recentItems.addEventListener('click', e => {
			if (e.target.tagName === 'DIV') {
				// Ensure the click is on a city name
				this.setCitySearch(e.target.textContent);
				this.city.form.requestSubmit(); // Validate the form programmatically
			}
		});
	}

	setCitySearch(val) {
		this.city.value = val;
	}

	/**
	 * Creates a list item element representing a city with an optional favorite status.
	 * The list item includes the city name and a star button to toggle the favorite status.
	 *
	 * @param {string} NameOfCity - The name of the city to display in the list item.
	 * @param {boolean} favorite - Indicates whether the city is marked as a favorite.
	 */
	createListItem(NameOfCity, favorite) {
		// Create element
		const listItem = document.createElement('li');
		listItem.classList.add('recentItem');
		const cityName = document.createElement('div');
		cityName.textContent = NameOfCity;
		listItem.appendChild(cityName);

		// Add star button
		const starButton = document.createElement('input');
		starButton.type = 'button';
		starButton.classList.add('star');
		if (favorite) {
			starButton.classList.add('favorite'); // Add favorite class for favorited items
		}

		// Add event listener to toggle favorite class
		starButton.addEventListener('click', () => {
			starButton.classList.toggle('favorite');
		});

		// Append star button to listItem
		listItem.appendChild(starButton);

		// Append listItem to recentItems
		this.recentItems.appendChild(listItem);
	}
}
