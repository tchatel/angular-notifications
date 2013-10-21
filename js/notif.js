'use strict';

angular.module('notif', [])

.controller('NotificationsCtrl', ['$scope', 'notification',
                                  function ($scope, notification) {
    $scope.notifications = notification.list;
}])

.factory('notification', ['$timeout',
                          function ($timeout) {
    var service = {
        list: {},
        add: function (text, undo, delay) {
            var timestamp = (new Date()).getTime();
            service.list[timestamp] = {
                text: text,
                canUndo: function () {
                    return angular.isFunction(undo);
                },
                undo: function () {
                    if (angular.isFunction(undo)) {
                        delete service.list[timestamp];
                        undo();
                    }
                }
            };
            $timeout(function () {
                delete service.list[timestamp];
            }, (delay || 5) * 1000);
        }
    };
    return service;
}]);

