import angular from 'angular';
import 'angular-ui-router';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';

import AuthComponent from './components/auth/auth.component';
import ArticleComponent from './components/article/article.component';
import PreviewComponent from './components/preview/preview.component';
import ArticlesComponent from './components/articles/articles.component';
import UserBlockComponent from './components/user-block/user-block.component';
import AddArticleComponent from './components/add-article/add-article.component';

import SessionService from './services/session.service';
import AuthRestService from './components/auth/auth_rest.service';
import ArticleRestService from './components/article/article_rest.service';
import ArticlesRestService from './components/articles/articles_rest.service';
import UserBlockRestService from './components/user-block/user-block_rest.service';

//import EnterPressedDirective from './directives/enter-pressed.directive';

angular.module('app', ['ngResource', 'ui.router', 'ngCookies'])
	.component('auth', new AuthComponent())
	.component('article', new ArticleComponent())
	.component('preview', new PreviewComponent())
	.component('articles', new ArticlesComponent())
	.component('userBlock', new UserBlockComponent())
	.component('addArticle', new AddArticleComponent())

	//.directive('enterPressed', EnterPressedDirective.createInstance())

	.service('sessionService', SessionService)
	.service('authRestService', AuthRestService)
	.service('articleRestService', ArticleRestService)
	.service('articlesRestService', ArticlesRestService)
	.service('userBlockRestService', UserBlockRestService)


	.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('HOME',{
				url: '/',
				template: '<preview></preview>',
				data: {
					role: 'unAuth'
				}
			})
			.state('LOGIN',{
				url: '/login',
				template: '<auth action="\'login\'"></auth>',
				data: {
					role: 'unAuth'
				}
			})
			.state('SIGNUP',{
				url: '/signup',
				template: '<auth action="\'signup\'"></auth>',
				data: {
					role: 'unAuth',
					state: 'signup'
				}
			})
			.state('ARTICLES',{
				url: '/articles',
				template: '<articles></articles>',
				data: {
					role: 'auth'
				}
			})
			.state('ADD_ARTICLE',{
				url: '/articles/add-article',
				template: '<add-article></add-article>',
				data: {
					role: 'auth'
				}
			})
			.state('ARTICLE',{
				url: '/articles/:articleId',
				template: '<article></article>',
				data: {
					role: 'auth'
				}
			});
	})
	.run(['$rootScope', '$window', 'sessionService' ,
		($rootScope, $window, sessionService)  => {
			$window.app = {
				authState: (state, user) => $rootScope.$apply(() =>
					sessionService.auth(state, JSON.parse(user)))
			};
	}]);