import Api from './services/Api';

let instance;

class Model {
	constructor(mediator) {
		if (!instance) {
			instance = this;
		}

		this.mediator = mediator;
		this.page = 0;
		this.query = '';

		return instance;
	}

	get currentPage() {
		return this.page;
	}

	get queryValue() {
		return this.query;
	}

	resetPage() {
		this.page = 0;
	}

	getItems() {
		let me = this;

		return Api.getArticles(this.page, this.query)
			.then(data => {
				me.mediator.onNext('articles.changed', data.response, me.page);
			})
		  	.catch(error => {
		  		throw new Error(error);
		  	});
	}

	changePage(value) {
		this.page+= value;
	}

	setQuery(value) {
		this.query = value;
	}
}

export default Model;
