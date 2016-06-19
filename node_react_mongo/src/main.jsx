import React from 'react';
import {render} from 'react-dom';
import Preview from './preview.jsx';
import Articles from './articles.jsx';
import Article from './article.jsx';
import NewArticle from './new-article.jsx';
import UserAuth from './user-auth.jsx';
import { Link, Route, Router, browserHistory} from 'react-router';

render((
	<Router history={browserHistory}>
		<Route path="/" component={Preview}>
		</Route>
		<Route path="/auth/:action" component={UserAuth}></Route>
		<Route path="/articles" component={Articles}>
		</Route>
		<Route path="/articles/newArticle" component={NewArticle}>
		</Route>
		<Route path="/articles/:id" component={Article}>
		</Route>
	</Router>

), document.getElementById('app'));