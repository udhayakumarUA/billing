angular.module('posApp')
  .controller("ChangepassCtrl", function($scope,$mdToast,$mdToast, $http,$state,$rootScope){
    console.log($rootScope.key)
    $scope.check = function(){
    if($scope.password == $scope.confirmpassword){
      console.log('ok')
      $http.post('/user/updatepassword',{key:$rootScope.key,password:$scope.password}).then(function(res){
        console.log(res)
        $scope.success('Password Changed')
        $state.go('dashboard')
        })
    }else{
      $scope.error('password does not match')
      console.log('not ok')
    }
  }
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

  });
