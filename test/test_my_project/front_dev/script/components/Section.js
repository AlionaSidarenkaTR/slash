import Base from './Base';
import Helper from './Helper';

class Section extends Base {
	drawArticles(articles) {
		return this.html`
			<ul>
		        ${articles.map(article => this.html`
		        	<li>
			            <h1><a href=$${article.web_url} target=_blank>$${article.headline.main}</a></h1>
						${(article.multimedia.length && article.multimedia[0].url) ? this.html`
							<img src=http:\/\/www.nytimes.com/${article.multimedia[0].url}></img>` : ''}
			            <p>$${article.snippet}</p>
			            <span>${Helper.formatDate(article.pub_date)}</span>
			            <span>${(article.byline && article.byline.original) || ''}</span>
			        </li>
		        `)}
		    </ul>
	    `;
	}
}

export default Section;
