import React from 'react';
import {Link} from 'react-router';

export default class UserBlock extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (<div className="user-block">
		      <Link to='/articles/newArticle'><button className="btn btn-success">ADD article</button></Link>
		      <button className="btn logout" onClick={this.logout.bind(this)}>Logout</button>
		  </div>);
	}

	logout() {
		let that = this;

		fetch('http://localhost:8080/logout',{
				method: 'DELETE'
			})
			.then((res) => {
				if (res.status !== 200) {
				 	return;
				}
				that.context.router.push({pathname: '/', query: {}});
			})
			.catch(function(err) {
				console.log('Fetch Error :-S', err);
			});
	}
}

UserBlock.contextTypes = {
	router: React.PropTypes.object.isRequired
};