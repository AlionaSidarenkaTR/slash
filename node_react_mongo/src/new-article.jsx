import React from 'react';
import {Link} from 'react-router';
import {jqueryForm} from 'jquery-form';

export default class NewArticle extends React.Component {
	constructor() {
		super();
		this.state = {
			title: '',
			author: '',
			content: '',
			article: {}
		};
	}

	handleChange(stateName, event) {
		let state = {};

		event.persist();
		state[stateName] = event.target.value;

	    this.setState(state);
	}

	render() {
		return (<div className="container">
		  <button className="btn btn-primary" onClick={this.context.router.goBack}>Back</button>
		  <div className="col-sm-6 col-sm-offset-3">
		    <h1><span className="fa fa-sign-in">NEW ARTICLE</span></h1>
		    <form ref="newArticleForm" enctype="multipart/form-data" className="form-signin" onSubmit={this.handleSubmit.bind(this)}>
		      <div className="form-group">
		        <label>Title</label>
		        <input type="text" name="title" placeholder="title" value={this.state.title} onChange={this.handleChange.bind(this, 'title')} className="input-block-level form-control"/>
		      </div>
		      <div className="form-group">
		        <label>File</label>
		        <input type="file" name="file" placeholder="file" className="input-block-level form-control"/>
		      </div>
		      <div className="form-group">
		        <label>Content</label>
		        <textarea name="textarea" value={this.state.content} onChange={this.handleChange.bind(this, 'content')} className="textarea form-control"></textarea>
		      </div>
		      <div className="form-group">
		        <label>Author</label>
		        <input type="text" name="author" value={this.state.author} onChange={this.handleChange.bind(this, 'author')} placeholder="author" className="input-block-level form-control"/>
		      </div>
		      <button type="submit" disabled={!this.state.title || !this.state.content || !this.state.author} className="btn btn-warning btn-lg">ADD ARTICLE</button>
		    </form>
		  </div>
		</div>);
	}

	handleSubmit(event) {
		let that = this;

		event.preventDefault();
		$(this.refs.newArticleForm).ajaxSubmit({
            error: function(xhr) {
        		console.log('Error: ' + xhr.status);
            },
            uploadProgress: function(event, position, total, percentCompleted) {
            	console.log(percentCompleted);
            },
            type: 'POST',
            url: 'http://localhost:8080/articles/add',
            success: function(response) {
                that.context.router.push({pathname: '/articles', query: {}});
            }
	    });
	}
}

NewArticle.contextTypes = {
    router: React.PropTypes.object.isRequired
};