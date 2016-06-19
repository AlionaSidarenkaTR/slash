import React from 'react';
import {Link} from 'react-router';
import UserBlock from './user-block.jsx';

export default class Articles extends React.Component {
	constructor() {
		super();
		this.state = {
			articles: []
		};
	}

	componentWillMount() {
		fetch('http://localhost:8080/articles/', {
		  method: 'GET'
		})
		.then((res) => res.json())
		.then((data) => {
			if (data.error) {
				throw new Error(data.error)
			} else {
				this.setState({
					articles: data.articles,
					user: data.user
				});
			}
		});
	}

	render() {
		return (<div className="container">
			<UserBlock />
			<ul>{this.state.articles.map((article, id) => {
			      return (<li key={id} className="text-center article">
			        <h1><Link to={`/articles/${article._id}`}>{article.title}</Link></h1>
			        <span>author: {article.author}</span>
			        <p>{article.text}</p>
			        {article.image ? <img src={`public/uploads/${article.image}`}></img> : ''}
			      </li>)
			    })}
			  </ul>
			</div>);
	}
}