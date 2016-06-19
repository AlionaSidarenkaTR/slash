import MainController from './controllers/MainController';
import View from './View';
import Model from './Model';
import Mediator from './services/Mediator';

(function() {
	'use strict';

	let mediator = new Mediator();
	let model = new Model(mediator);
	let view = new View(mediator);
	let mainCtrl = new MainController(model, view, mediator);

	view.createBaseLayout();
	view.addListeners();
	mainCtrl.subscribe();
	model.getItems();
})();