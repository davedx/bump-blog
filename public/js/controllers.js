'use strict';

/* Controllers */
function PostsController($scope, $http) {
	$http.get('/api/posts').success(function(data) {
		$scope.posts = data;
	});
}

function PostController($scope, $routeParams, $http) {
	$http.get('/api/posts/'+$routeParams.postid).success(function(data) {
		$scope.post = data;
	});
}

function EditPostController($scope, $routeParams, $http) {
	if($routeParams.postid) {
		$http.get('/api/posts/'+$routeParams.postid).success(function(data) {
			$scope.post = data;
			$scope.postid = $routeParams.postid;
		});
	}
	$scope.submit = function() {
		var data = {
			title: $scope.post.title,
			date: $scope.post.date,
			author: $scope.post.author,
			body: $scope.post.body,
		}
		var path = '/api/posts';
		if($routeParams.postid) {
			path = path + '/' + $routeParams.postid;
		}
		$http.post(path, data).success(function(data) {
			$scope.message = 'Saved!';
		});
	};
}
