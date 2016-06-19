import './../../style/articles.less';

class MainController {
	constructor(model, view, mediator) {
		this.mediator = mediator;
		this.model = model;
		this.view = view;
	}

	subscribe() {
		this.mediator.subscribe('pagination.clicked', ({eventObject}) => {
			let pageDelta = 0;
			let classList = eventObject.target.classList;

			if (classList.contains('next')) {
				pageDelta = 1;
			} else if (classList.contains('prev')) {
				pageDelta = -1;
			}

			this.model.changePage(pageDelta);
			this.model.getItems();

			document.body.scrollTop = 0;
		}, this);

		this.mediator.subscribe('searchInput.keydown', ({eventObject}) => {

			if (eventObject.which === 13 || eventObject.keyCode === 13) {
				this.model.setQuery(eventObject.target.value);
				this.model.resetPage();
				this.model.getItems();

				document.body.scrollTop = 0;
			}
		}, this);
	}
}

export default MainController;
