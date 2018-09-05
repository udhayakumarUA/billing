'use strict';

angular.module('posadminApp')
  .controller('SingleusersCtrl', function ($scope,$http,$stateParams,$state,$mdToast,$mdDialog) {
    $http.post('/user/getuser',{id:$stateParams.id}).then(function(res){
      console.log(res);
      $scope.suser = res.data.suser;
    });
    $scope.updata=function () {
      $http.post('/user/updata',{id:$stateParams.id,expiredate:$scope.extend}).then(function (res) {
       console.log(res)
        $scope.suser.expiredate=res.data.date[0].expiredate;
        $scope.success()
      })

    }
    $scope.success=function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Updated successfully')
          .position('top right' )
          .hideDelay(3000)
      );
    }
    $scope.showConfirm = function(ev,type) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Are you sure? Do you want to delete it ?')
          .textContent('Deleting process cannot be undone. On deleting, clients cannot be updated or supported further.')
          .ariaLabel('Lucky day')
          .targetEvent(ev)
          .ok('Yes')
          .cancel('No');

    $mdDialog.show(confirm).then(function() {
      $http.post('/user/deleteuser',{id:$stateParams.id}).then(function(res){
          if(type =='offline'){
          $state.go('pos.offlineusers')
          }
          else if(type=='online'){
            $state.go('pos.onlineusers')
          }
          else{$state.go('/')}
      });
    }, function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };

  });
