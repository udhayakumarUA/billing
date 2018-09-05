'use strict';

angular.module('posadminApp')
  .controller('OfflineusersCtrl', function ($scope,$http) {
    $http.post('/user/offlineusers').then(function (res) {
      console.log(res);
      $scope.offline=res.data.offline;
    })
  });
