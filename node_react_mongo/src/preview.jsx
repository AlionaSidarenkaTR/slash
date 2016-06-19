import React from 'react';
import {Link} from 'react-router';
import main from '../styles/main.css';

export default class Preview extends React.Component {
	constructor() {
		super();
		this.state = {
			actions: ['login', 'signup', 'facebook', 'google-plus']
		};
	}

  	render() {
  		return (
  			<div className="container">
  				<div className="jumbotron text-center">
  					<h1><span className="fa fa-lock">Node Authentication</span></h1>
  					<p>Login or Register with</p>
					<ul className="preview">
						{this.state.actions.map((action, id) => {
							if (action === 'facebook' || action === 'google-plus') {
								return (<li key={id}>
									<button className="btn btn-primary" id={action} onClick={this.authWithSocNet.bind(this, action)}>
										<span className={`fa fa-${action}`}>{action}</span>
									</button>
								</li>)
							}
							return (<li key={id}><Link to={`/auth/${action}`} className="btn btn-default">{action}</Link></li>)
						})}
						{this.props.children}
					</ul>
				</div>
			</div>
  		);
  	}

  	authWithSocNet(action) {
  		action = (action === 'facebook') ? action : 'google';
  		this.openAuthWindow(`http:\/\/localhost:8080/auth/${action}`);
  	}

  	openAuthWindow(url) {
		let width = 1000,
            height = 650,
            top = (window.outerHeight - height) / 2,
            left = (window.outerWidth - width) / 2,
            windowParams = `width=${width},height=${height},scrollbars=0,top=${top},left=${left}`;

        window.open(url, 'social_login', windowParams);
	}
}

Preview.propTypes = {
	children: React.PropTypes.object
};
