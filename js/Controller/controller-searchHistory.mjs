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

	/**
	 * Adds an item to the history list if it does not already exist.
	 * Updates both the model and the view with the new item.
	 *
	 * @param {string} item - The item to be added to the history list.
	 * @param {boolean} favorite - Indicates whether the item is marked as a favorite.
	 */
	addItemToList(item, favorite) {
		if (!this.model.getIfExist(item)) {
			this.model.addToHistory(item, favorite);
			this.view.createListItem(item, favorite);
		}
	}

	/**
	 * Creates a list item in the view and sets up a click handler to toggle the favorite status.
	 *
	 * @param {Object} history - The history object to be represented as a list item.
	 * @param {string} history.name - The name of the history item.
	 * @param {boolean} history.favorite - Indicates whether the history item is marked as favorite.
	 */
	createListItem(history) {
		this.view.createListItem(history.name, history.favorite, () => {
			history.favorite = !history.favorite;
			this.model.updateLocalStorage(history);
		});
	}
}
