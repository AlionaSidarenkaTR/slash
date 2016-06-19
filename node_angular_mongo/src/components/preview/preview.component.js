import PreviewController from './preview.controller';
import PreviewStyles from './preview.css';

class PreviewComponent {
	constructor () {
		this.templateUrl = 'src/components/preview/preview.html';
		this.controller = PreviewController;
		this.controllerAs = 'preview';
	}
}

export default PreviewComponent;