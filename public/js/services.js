'use strict';

/* Services */
angular.module('services', ['ngResource']).

	factory('Post', function($resource){
	  return $resource('http://localhost:3000/posts/:postId.json', {}, {
	    query: {method:'GET', params:{postId:'posts'}, isArray:true},
	    get: {method:'JSONP'}
  });
});
