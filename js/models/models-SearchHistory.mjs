export default class SearchHistoryModel {
	constructor() {
		this.searchHistory = JSON.parse(window.localStorage.getItem('history')) || [];
		console.log(this._searchHistory);
	}

	get searchHistory() {
		return this._searchHistory.sort((a, b) => b.favorite - a.favorite);
	}

	set searchHistory(value) {
		this._searchHistory = value;
		window.localStorage.setItem('history', JSON.stringify(value));
	}
}
