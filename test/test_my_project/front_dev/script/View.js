import InstanciesFactory from './utils/InstanciesFactory';

class View {
	constructor(mediator) {
        this.mediator = mediator;
        this.mediator.subscribe('articles.changed', this.render, this);
    }

    get header() {
        return InstanciesFactory.createInstance('base', {
            temp: '<header></header>',
            selector: 'header'
        });
    }

    get section() {
        return InstanciesFactory.createInstance('section', {
            temp: '<section></section>',
            selector: 'section'
        });
    }

    get footer() {
        return InstanciesFactory.createInstance('base', {
            temp: '<footer></footer>',
            selector: 'footer'
        });
    }

    get resultsCount() {
        return InstanciesFactory.createInstance('base', {
            temp: '<span class=results></span>',
            selector: '.results'
        });
    }

    get searchInput() {
        return InstanciesFactory.createInstance('inputComponent', {
            type: 'text',
            placeholder: 'Search',
            className: 'search',
            selector: '.search'
        });
    }

    get pagination() {
        return InstanciesFactory.createInstance('pagination', {
            selector: '.pages'
        });
    }

    addListeners() {
        this.pagination.addListener('click', (eventObject) => this.mediator.onNext('pagination.clicked', {
            eventObject: eventObject
        }));
        this.searchInput.addListener('keydown', (eventObject) => this.mediator.onNext('searchInput.keydown', {
            eventObject: eventObject
        }));
    }

	createBaseLayout() {
		this.header.createInnerTemp([this.searchInput.temp, this.resultsCount.temp]);
		this.footer.createInnerTemp(this.pagination.drawPages());
	}

	render(response, page) {
		let meta = response.meta;

    	this.section.createInnerTemp(this.section.drawArticles(response.docs));
    	this.resultsCount.createInnerTemp(meta.hits);
    	this.pagination.createInnerTemp(this.pagination.drawPages([{
    		value: 'Prev',
			hide: page === 0,
			classList: 'prev'
		}, {
			value: (meta.hits > 0) ? page + 1 : ''
		}, {
			value: 'Next',
			hide: meta.hits <= (page + 1) * 10,
			classList: 'next'
    	}]));
    }
}

export default View;
