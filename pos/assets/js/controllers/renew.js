angular.module('posApp')
  .controller("RenewCtrl", function($scope,$mdToast, $http,$state,$rootScope){
    $scope.renew=function () {
      $http.post('http://139.59.82.229/user/getuser1',{key:$rootScope.key}).then(function (res) {
        console.log(res.data.suser)
        $scope.updateuser(res.data.suser)
      })
    }
    $scope.updateuser=function (user) {
      $http.post('/user/updateexpiredate',user).then(function (res) {
        console.log(res)

        $scope.success();
        $state.reload()
      })
    }
    $scope.success = function() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('License Renewed')
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };

  });
