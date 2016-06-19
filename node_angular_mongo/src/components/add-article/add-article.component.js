import AddArticleController from './add-article.controller';
import AddArticleStyles from './add-article.css';

class AddArticleComponent {
	constructor() {
		this.templateUrl = 'src/components/add-article/add-article.html';
		this.controller = AddArticleController;
		this.controllerAs = 'addArticleCtrl';
	}
}

export default AddArticleComponent;