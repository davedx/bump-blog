'use strict';

/* App Module */

angular.module('blog', ['services']).
	config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
  		when('/posts', {templateUrl: '/partials/posts.html',	controller: PostsController}).
  		when('/posts/new', {templateUrl: '/partials/edit-post.html', controller: EditPostController}).
  		when('/posts/:postid', {templateUrl: '/partials/post.html', controller: PostController}).
  		when('/posts/:postid/edit', {templateUrl: '/partials/edit-post.html', controller: EditPostController}).
  		otherwise({redirectTo: '/posts'});
}]);
