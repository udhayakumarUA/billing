'use strict';
angular.module('posadminApp')
  .controller('changepassword', function ($scope, $mdDialog,$mdToast, $http,$state) {
    console.log('ssddssd')
    $scope.changepassword = ()=>{
      if($scope.newpass==$scope.newpass1){
        
        $http.post('/admin/changepassword',{old:$scope.oldpass,password:$scope.newpass})
        .then((res)=>{
          console.log(res)
          $state.go('pos.index')
          $scope.success()
        }).catch((err)=>{
          console.log(err)
          $scope.error(err.data.err)
        })
      }
      else{
        $scope.error('password doesn\'t match')
      }
    }
    $scope.success=function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('password changed successfully')
          .position('top right' )
          .hideDelay(3000)
      );
    }
    $scope.error=function(err){
      $mdToast.show(
        $mdToast.simple()
          .textContent(err)
          .position('top right' )
          .hideDelay(3000)
      );
    }
  });