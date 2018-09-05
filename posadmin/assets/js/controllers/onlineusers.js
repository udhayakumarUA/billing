'use strict';

angular.module('posadminApp')
  .controller('OnlineusersCtrl', function ($scope,$http) {
    $http.post('/user/onlineusers').then(function (res) {
      console.log(res);
      $scope.online=res.data.online;
    })
  });
