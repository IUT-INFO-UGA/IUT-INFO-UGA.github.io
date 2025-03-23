export default class SearchHistoryController {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		//remove all other ellement
		this.view.recentItems.innerHTML = '';
		// Update the list when the search history changes
		this.model.searchHistory.forEach(history => {
			// Create a new list item for each history entry
			this.createListItem(history);
		});

		// Handle clicks on star buttons
		this.view.recentItems.querySelectorAll('.star').forEach(starButton => {
			starButton.addEventListener('click', () => {
				const history = this.model.searchHistory.find(
					h => h.name === starButton.previousElementSibling.textContent
				);
				if (history) {
					history.favorite = !history.favorite;
					this.updateLocalStorage(this.model.searchHistory);
				}
			});
		});
	}

	createListItem(history) {
		this.view.createListItem(history.name, history.favorite, () => {
			history.favorite = !history.favorite; // Update the favorite status
			this.updateLocalStorage(this.model.searchHistory); // Save changes to localStorage
		});

		listItem.appendChild(starButton);
	}

	updateLocalStorage(history) {
		console.log(history);
		window.localStorage.setItem('history', JSON.stringify(history));
	}
}
