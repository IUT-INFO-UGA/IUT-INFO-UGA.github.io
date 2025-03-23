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
