class EnterPressedDirective {
	constructor() {
        this.restrict = 'A';
        this.scope = {};
    }

  link(scope, element) {
    this.scope = scope;
    console.log(element);
  }

  static createInstance() {
    EnterPressedDirective.instance = new EnterPressedDirective();
    return EnterPressedDirective.instance;
  }
}

export default EnterPressedDirective;