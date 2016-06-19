let instance;

class Mediator {
	constructor() {
		if (!instance) {
			instance = this;
		}
		this.eventBus = {};
	}

	subscribe(eventName, callback, context) {
		let callbackObj = {
			callback,
			context
		};

		if (!this.eventBus[eventName]) {
			this.eventBus[eventName] = [callbackObj];
		} else {
			this.eventBus[eventName].push(callbackObj);
		}
	}

	dismiss(eventName, callback, context) {
		if (this.eventBus[eventName].length) {
			this.eventBus[eventName] = this.eventBus[eventName].filter((callbackObj, index) => {
				return !(callbackObj.callback === callback && callbackObj.context === context)
			});
		}
	}

	onNext(eventName, ...rest) {
		if (this.eventBus[eventName]) {
			this.eventBus[eventName].forEach((callbackObj) => {
				callbackObj.callback.apply(callbackObj.context, rest);
			});
		}
	}
}

export default Mediator;
