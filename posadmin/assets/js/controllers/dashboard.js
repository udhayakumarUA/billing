'use strict';

angular.module('posadminApp')
  .controller('dashboardCtrl', function ($scope,$http,$state) {
    $scope.renewals = []
    $scope.skip=0;
    $scope.noMore = true;
    $scope.count=1;
    $http.post('/user/getusercount').then(function (res) {
      console.log(res);
      $scope.usercount = res.data
    })
    $http.post('/user/offlineusers').then(function (res) {
      console.log(res);
      $scope.offline=res.data.offline;
    })
    $http.post('/user/onlineusers').then(function (res) {
        console.log(res);
        $scope.online=res.data.online;
      })
      $http.post('/user/renewals').then(function (res) {
        console.log(res);
        $scope.renewals=res.data.result;
        $scope.count = res.data.count
          $scope.skip = $scope.skip+=10;
          if ($scope.count < 11 ){
            $scope.noMore = true;
          }
          else{$scope.noMore = false;}
      })
      $scope.more = function(){
        $http({
          url: '/user/getmore',
          method: "POST",
          params: {skip: $scope.skip}
        }).then(function (res) {
          $scope.count = res.data.count;
          for (var i = 0; i < res.data.result.length; i++) {
            $scope.renewals.push(res.data.result[i])
          }
          $scope.skip = $scope.skip += 10;
          if ($scope.skip >= $scope.count) {
            $scope.noMore = true;
          }
        });
      }

  });
