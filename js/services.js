'use strict';

/* Services */

var moduleSrv = angular.module('gamestore.services', []);

moduleSrv.factory('notification', ['$timeout', function ($timeout) {

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


moduleSrv.factory('catalogPromise', ['$http', '$q', function ($http, $q) {
    return {
        getList: function () {
            return $http.get("data/catalog.json").then(function (response) {
                var list = {};
                for (var i = 0 ; i < response.data.length ; i++) {
                    list[response.data[i].ref] = response.data[i];
                }
                return list;
            });
        },
        getItem: function (ref) {
            return $http.get("data/" + ref + ".json").then(function (response) {
                return response.data;
            });
        }
    };
}]);



moduleSrv.value('tva', 19.6);

moduleSrv.factory('cart', ['tva', 'notification', function (tva, notification) {
    return {
        rows: {},
        add: function (game) {
            var row = this.rows[game.ref];
            if (row) {
                row.qty++;
            } else {
                this.rows[game.ref] = {
                    game: game,
                    qty: 1
                };
            }
        },
        total: function () {
            var sum = 0;
            for (var i in this.rows) {
                sum += this.rows[i].qty * this.rows[i].game.price;
            }
            return sum;
        },
        totalHT: function () {
            return this.total() * 100 / (100 + tva);
        },
        empty: function () {
            return Object.keys(this.rows).length == 0;
        },
        remove: function (row) {
            var self = this;
            delete self.rows[row.game.ref];
            notification.add("Article supprimé : " + row.game.name + ". ", function () {
                self.rows[row.game.ref] = row;
            }, 6);
        }
    };
}]);