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
				this.model.togle(starButton.previousElementSibling.textContent);
			});
		});
	}

	addItemToList(item, favorite) {
		if (!this.model.getIfExist(item)) {
			this.model.addToHistory(item, favorite);
			this.view.createListItem(item, favorite);
		}
	}

	createListItem(history) {
		this.view.createListItem(history.name, history.favorite, () => {
			history.favorite = !history.favorite;
			this.model.updateLocalStorage(history);
		});
	}
}
