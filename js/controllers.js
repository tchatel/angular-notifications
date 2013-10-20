'use strict';

/* Controllers */

var moduleCtrl = angular.module('gamestore.controllers', ['gamestore.services']);

moduleCtrl.controller('NotificationsCtrl', ['$scope', 'notification', function ($scope, notification) {

    $scope.notifications = notification.list;
    $scope.canUndo = function (notification) {
        return angular.isFunction(notification.undo);
    };
    $scope.undo = function (notification) {
        angular.isFunction(notification.undo) && notification.undo();
    };

}]);

moduleCtrl.controller('MainCtrl', ['$scope', '$location', 'cart', function ($scope, $location, cart) {
    $scope.addCart = function (game) {
        cart.add(game);
        $location.url("/cart");
    }
}]);

moduleCtrl.controller('CatalogCtrl', ['$scope', 'catalogPromise', function ($scope, catalogPromise) {
    catalogPromise.getList().then(function (data) {
        $scope.catalog = data;
    });
}]);

moduleCtrl.controller('GameCtrl', ['$scope', '$routeParams', 'catalogPromise', function ($scope, $routeParams, catalogPromise) {
    catalogPromise.getItem($routeParams.ref).then(function (data) {
        $scope.game = data;
    });
}]);

moduleCtrl.controller('CartCtrl', ['$scope', 'cart', function ($scope, cart) {
    $scope.cart = cart;
}]);
