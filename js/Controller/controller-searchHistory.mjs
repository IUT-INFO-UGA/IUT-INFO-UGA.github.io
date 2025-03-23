export default class SearchHistoryController {
	constructor(model, view) {
		this.model = model;
		this.view = view;
		//remove all other ellement
		this.view.recentItems.innerHTML = '';
		// Update the list when the search history changes
		this.model.getSearchHistory().forEach(history => {
			// Create a new list item for each history entry
			this.createListItem(history);
		});

		// Handle clicks on star buttons
		this.view.recentItems.querySelectorAll('.star').forEach(starButton => {
			starButton.addEventListener('click', () => {
				const history = this.model
					.getSearchHistory()
					.find(h => h.name === starButton.previousElementSibling.textContent);
				if (history) {
					history.favorite = !history.favorite;
					this.model.updateLocalStorage(history);
				}
			});
		});
	}

	addItemToList(item, favorite) {
		this.view.createListItem(item, favorite, () => {
			this.model.updateLocalStorage(history);
		});
	}

	createListItem(history) {
		this.view.createListItem(history.name, history.favorite, () => {
			history.favorite = !history.favorite;
			this.model.updateLocalStorage(history);
		});
	}
}
