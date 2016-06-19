import React from 'react';
import {Link} from 'react-router';

export default class Article extends React.Component {
	constructor() {
		super();
		this.state = {
			article: {}
		};
	}

	fetchArticle(id) {
		let that = this;

		fetch(`http:\/\/localhost:8080/articles/${id}`, {
		  method: 'GET'
		})
		.then((res) => res.json())
		.then((data) => {
			that.setState({
				article: data.article
			});
		});
	}

	componentDidMount(props) {
		debugger;
		this.fetchArticle(this.props.params.id);
	}

	render() {
		return (<div className="container">
		  <button className="btn btn-primary" onClick={this.context.router.goBack}>Back</button>
	      <div className="text-center article">
	        <h1>{this.state.article.title}</h1>
	        <span>author: {this.state.article.author}</span>
	        <p>{this.state.article.text}</p>
	        {this.state.article.image ? <img src={`http:\/\/localhost:3000/public/uploads/${this.state.article.image}`}></img> : ''}
	      </div>
		</div>);
	}
}

Article.propTypes = {
	params: React.PropTypes.shape({
		id: React.PropTypes.string
	})
};

Article.contextTypes = {
    router: React.PropTypes.object.isRequired
};