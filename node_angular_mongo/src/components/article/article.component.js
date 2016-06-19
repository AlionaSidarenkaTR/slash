import ArticleController from './article.controller';
import ArticleStyles from './article.css';

class ArticleComponent {
	constructor() {
		this.templateUrl = 'src/components/article/article.html';
		this.controller = ArticleController;
		this.controllerAs = 'articleCtrl';
	}
}

export default ArticleComponent;