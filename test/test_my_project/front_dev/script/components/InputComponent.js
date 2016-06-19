import Base from './Base';

class InputComponent extends Base {
	constructor({type, className, placeholder, selector}) {
		super({selector});
		this.temp =
			`<input type=${type} class=${className || ''} placeholder=${placeholder}></input>`;
	}
}

export default InputComponent;
