import ArticlesController from './articles.controller';
import ArticlesStyles from './articles.css';

class ArticlesComponent {
	constructor() {
		this.templateUrl = 'src/components/articles/articles.html';
		this.controller = ArticlesController;
		this.controllerAs = 'articles';
	}
}

export default ArticlesComponent;