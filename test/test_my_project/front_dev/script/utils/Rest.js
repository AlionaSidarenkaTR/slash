class Rest {
	static get(url) {
		return fetch(url)
		  	.then(response => {
				const OK_STATUS = 200;

		  		if (response.status !== OK_STATUS) {
		        	return;
		      	} else {
		      		return response.json();
		      	}
		    });
	}
}

export default Rest;
