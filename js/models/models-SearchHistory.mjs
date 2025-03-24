export default class SearchHistoryModel {
	constructor() {
		this.searchHistory = JSON.parse(window.localStorage.getItem('history')) || [];
	}

	getSearchHistory() {
		return this.searchHistory.sort((a, b) => b.favorite - a.favorite);
	}

	addToHistory(name, status) {
		this.searchHistory.push({ name, status });
		this.updateLocalStorage();
	}

	/**
	 * Toggles the favorite status of a search history item by its name.
	 *
	 * @param {string} name - The name of the search history item to toggle.
	 * @returns {void}
	 */
	togle(name) {
		const element = this.searchHistory.find(h => h.name === name);
		if (element) {
			element.favorite = !element.favorite;
			this.updateLocalStorage();
		}
	}

	getIfExist(name) {
		return this.searchHistory.find(h => h.name === name) || null;
	}

	updateLocalStorage() {
		window.localStorage.setItem('history', JSON.stringify(this.searchHistory));
	}
}
