angular.module('posApp')
  .controller("LoginCtrl", ['$scope', '$mdToast', '$http','$state','$rootScope', function($scope, $mdToast, $http,$state,$rootScope) {
    $scope.login=function (user) {
      $http.post('user/signinuser',{username:$scope.username,password:$scope.password,storeid:$scope.storeid}).then(function (res) {
        console.log(res);
        localStorage.setItem('role',res.data.me.role);
        if(res.data.me.role=='SA'){
          localStorage.setItem('clientid',res.data.me.id);
          $scope.success(res.data.message);
          $state.go('dashboard');
        }
        else if(res.data.me.role=='B'){
          console.log('biller enters')
          localStorage.setItem('clientid',res.data.me.id);          
          $scope.success(res.data.message);
          $state.go('pointofsale');
        }
        else{
        localStorage.setItem('clientid',res.data.me.id)
        $scope.success(res.data.message);
        $state.go('dashboard');
        }
       
      }).catch(function (err) {
        console.log(err);
        $scope.error(err.data.err)
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
