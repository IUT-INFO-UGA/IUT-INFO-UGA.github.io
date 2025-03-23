export default class SearchHistoryModel {
	constructor() {
		this.searchHistory = JSON.parse(window.localStorage.getItem('history')) || [];
	}

	getSearchHistory() {
		return this.searchHistory.sort((a, b) => b.favorite - a.favorite);
	}

	updateLocalStorage(history) {
		window.localStorage.setItem('history', JSON.stringify(history));
	}
}
