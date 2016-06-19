import Base from './Base';

class Pagination extends Base {
	drawPages(pages=[]) {
		return this.html`
			<ul class=pages>
				${pages.map(page => this.html`
					<li class=${page.hide ? 'hide ' : ''}${page.classList}>${page.value}</li>
				`)}
			</ul>
		`;
	}
}

export default Pagination;
