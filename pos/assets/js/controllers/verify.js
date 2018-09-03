angular.module('posApp')
  .controller("VerifyCtrl", ['$scope','$mdToast','$http','$state','$rootScope', function($scope,$mdToast, $http,$state,$rootScope) {

    $scope.verify=function () {
      $http.post('http://139.59.82.229/user/verifyuser',{key:$scope.key}).then(function (res) {
        console.log(res);
        $scope.user=res.data.user;
        localStorage.setItem('key',$scope.user.key);
         $scope.success(res.data.message)
        $scope.adduser($scope.user);
       $rootScope.role='SA'
      }).catch(function (err) {
        console.log(err);
        $scope.error(err.data.message)
      })
    };

    $scope.adduser=function (user) {
      $http.post('user/createuser',user).then(function (res) {
        console.log(res);
        $state.go('dashboard');
      })
    };

     $scope.error = function(err) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(err)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };

    $scope.success = function(msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('top right')
          .theme('success-toast')
          .hideDelay(1000)
      );
    };


  }]);
