'use strict';
var app = angular.module('app', []);

app.controller('LoginController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.email = "";
    $scope.password = "";
    $scope.signIn = function () {
        $http.post('/login', {email: $scope.email, password: $scope.password}).
            success(function (data, status, headers, config) {
                $window.location.href = '/home';
            }).
            error(function (data, status, headers, config) {
                console.log(data);
            });
    }
}]);

app.controller('RegisterController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    $scope.name = "";
    $scope.username = "";
    $scope.email = "";
    $scope.password = "";
    $scope.register = function () {
        $http.post('/register', {
            name: $scope.name
            username: $scope.username
            email: $scope.email,
            password: $scope.password,
        }).
            success(function (data, status, headers, config) {
                $window.location.href = '/home';
            }).
            error(function (data, status, headers, config) {
            });
    }
}]);