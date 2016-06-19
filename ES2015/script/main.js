(function() {
	'use strict';
	let page = 0;
	let query = '';
	let resultsBlock;

	function getArticles(pageNum = 0, q = '') {
		const API_KEY = '923f3f09b31dceea6dd4dba3f58339ab:7:74953694';
		const OK_STATUS = 200;

		let params = new Map();
		let paramsStr = '';
		page = pageNum;

		params.set('page', pageNum);
		q === '' ? params.delete(q) : params.set('q', q);
		
		for (let entry of params) {
			paramsStr+= `${entry[0]}=${entry[1]}&`;
		}

		paramsStr = paramsStr.slice(0, -1);
		let url = `http:\/\/api.nytimes.com/svc/search/v2/articlesearch.json?${paramsStr}&api-key=${API_KEY}`;

		return fetch(url)
		  	.then(response => {
		  		if (response.status !== OK_STATUS) {
		        	return;  
		      	} else {
		      		return response.json();
		      	}
		    })
			.then(data => render(data.response))
		  	.catch(error => {
		  		throw new Error(error)
		  	});
	}

	function html(literals, ...substs) {
	    return literals.raw.reduce((acc, lit, i) => {
	        let subst = substs[i-1];

	        if (Array.isArray(subst)) {
	            subst = subst.join('');
	        }

	        if (acc.endsWith('$')) {
	            subst = subst ? htmlEscape(subst) : '';
	            acc = acc.slice(0, -1);
	        }

	        return `${acc}${subst}${lit}`;
	    });
	}

	function htmlEscape(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/>/g, '&gt;')
                  .replace(/</g, '&lt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#39;')
                  .replace(/`/g, '&#96;');
    }

	function renderArticles(articles) {
		return html`
		<ul>
	        ${articles.map(article => html`
	        	<li>
		            <h1><a href=$${article.web_url} target=_blank>$${article.headline.main}</a></h1>
		            <p>$${article.snippet}</p>
		            <span>${formatDate(article.pub_date)}</span>
		            <span>${(article.byline && article.byline.original) || ''}</span>
		        </li>
	        `)}
	        </ul>
	    `;
	}

    function renderPages(metaData) {
    	let pages = document.querySelectorAll('.pages li');

    	Array.from(pages, (p, i) => {
    		if (i === 0) {
    			page === 0 && p.classList.add('hide');
    			page > 0 && p.classList.remove('hide');
    		} else if (i === 1) {
    			p.innerHTML = (metaData.hits > 0) ? page + 1 : '';		
    		} else if (i === 2) {
    			let condition = metaData.hits <= (page + 1) * 10;
    			condition && p.classList.add('hide');
    			!condition && p.classList.remove('hide');
    		} 
    	});
    }

    function renderHeader(metaData) {
    	let resultsBlock = document.querySelector('.results');

    	resultsBlock.innerHTML = metaData.hits;
    }

    function formatDate(date) {
    	let newDate = new Date(date);

    	return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`;
    }

    function render(response) {
    	document.getElementsByTagName('section')[0].innerHTML = renderArticles(response.docs);
    	renderHeader(response.meta);
    	renderPages(response.meta);
    	document.body.scrollTop = 0;
    }

    function init() {
		let layout = '<header><input type=text placeholder=Search></input>\
			<span class=results></span></header><section></section><footer><ul class=pages>\
			<li class=prev>Prev</li><li></li><li class=next>Next</li></ul></footer>';

		document.body.innerHTML+= layout;

		let pagesBlock = document.querySelector('.pages');
		let searchInput = document.querySelector('input');

		pagesBlock.addEventListener('click', e => {
			if (e.target.classList.contains('next')) {
				page+= 1;
			} else if (e.target.classList.contains('prev')) {
				page-= 1;
			} else {
				return
			}

			getArticles(page, query);
		});

		searchInput.addEventListener('keydown', e => {
			if (e.which === 13 || e.keyCode === 13) {
				query = e.target.value;

				getArticles(undefined, query);
			}
		});
    }

	init();
	getArticles();
})()