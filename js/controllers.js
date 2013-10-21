'use strict';

/* Controllers */

angular.module('gamestore.controllers', ['gamestore.services'])

.controller('NotificationsCtrl', ['$scope', 'notification', function ($scope, notification) {

    $scope.notifications = notification.list;
    $scope.canUndo = function (notification) {
        return angular.isFunction(notification.undo);
    };
    $scope.undo = function (notification) {
        angular.isFunction(notification.undo) && notification.undo();
    };

}])

.controller('MainCtrl', ['$scope', '$location', 'cart', function ($scope, $location, cart) {
    $scope.addCart = function (game) {
        cart.add(game);
        $location.url("/cart");
    }
}])

.controller('CatalogCtrl', ['$scope', 'catalogPromise', function ($scope, catalogPromise) {
    catalogPromise.getList().then(function (data) {
        $scope.catalog = data;
    });
}])

.controller('GameCtrl', ['$scope', '$routeParams', 'catalogPromise', function ($scope, $routeParams, catalogPromise) {
    catalogPromise.getItem($routeParams.ref).then(function (data) {
        $scope.game = data;
    });
}])

.controller('CartCtrl', ['$scope', 'cart', function ($scope, cart) {
    $scope.cart = cart;
}])
