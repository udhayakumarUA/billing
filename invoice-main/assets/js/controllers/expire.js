angular.module('posApp')
  .controller("ExpireCtrl", function($scope,$mdToast, $http,$state,$rootScope){
    $scope.renew=function () {
      $http.post('http://139.59.44.215/user/getuser1',{key:$rootScope.key}).then(function (res) {
        console.log(res.data.suser)
        $scope.updateuser(res.data.suser)
      })
    }
    $scope.updateuser=function (user) {
      $http.post('/user/updateexpiredate',user).then(function (res) {
        console.log(res)
        $state.go('dashboard')
      })
    }

  });
