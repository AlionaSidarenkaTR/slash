import React from 'react';
import $ from 'jquery';
import { Router } from 'react-router';
import {Link} from 'react-router';

export default class Post extends React.Component {
	constructor() {
		super();
		this.state = {
			message: '',
			email: '',
			password: ''
		};
	}

	handleChange(stateName, event) {
		let state = {};

		event.persist();
		state[stateName] = event.target.value;

	    this.setState(state);
	}

	render() {
		return (<div className='container'>
			<div className="col-sm-6 col-sm-offset-3">
				<h1>
					<span className="fa fa-sign-in">{this.props.params.action}</span>
				</h1>
				<form className="form-signin" onSubmit={this.sendFormData.bind(this)}>
					<div>{this.state.message}</div>
					<div className="form-group">
						<label>Email</label>
						<input className="input-block-level form-control" onChange={this.handleChange.bind(this, 'email')} value={this.state.email} ref="email" type="text" name="email" placeholder="email" id="email"/>
					</div>
					<div className="form-group">
						<label>Password</label>
						<input className="input-block-level form-control" onChange={this.handleChange.bind(this, 'password')} value={this.state.password} ref="password" type="text" name="password" placeholder="password" id="password"/>
					</div>
					<button className="btn btn-warning btn-lg" disabled={!this.state.email || !this.state.password} type="submit" id="submit">{this.props.params.action}</button>
				</form>
				<p>
					<Link to="/">Home</Link>
				</p>
				<hr/>
			</div>
		</div>)
	}

	sendFormData(e) {
		e.preventDefault();

		$.ajax({
			method: "POST",
			data: {email: this.refs.email.value, password: this.refs.password.value},
			url: `http:\/\/localhost:8080/auth/local-${this.props.params.action}`
		})
		.then((data) => {
			if (data.result === 'failure') {
			this.setState({
				message: data.message
			});
			} else {
				this.context.router.push({pathname: '/articles', query: {}});
			}
		})
	}
}

Post.propTypes = {
	params: React.PropTypes.shape({
		action: React.PropTypes.string
	})
};

Post.contextTypes = {
    router: React.PropTypes.object.isRequired
};