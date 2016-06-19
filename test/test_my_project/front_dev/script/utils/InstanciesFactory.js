import Base from './../components/Base';
import Section from './../components/Section';
import InputComponent from './../components/InputComponent';
import Pagination from './../components/Pagination';

const classMapper = {
	base: Base,
	section: Section,
	inputComponent: InputComponent,
	pagination: Pagination
}

class InstanciesFactory {
	static createInstance(className, options) {
		return new classMapper[className](options);
	}
}

export default InstanciesFactory;
