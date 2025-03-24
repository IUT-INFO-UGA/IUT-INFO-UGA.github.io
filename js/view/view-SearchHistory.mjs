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
