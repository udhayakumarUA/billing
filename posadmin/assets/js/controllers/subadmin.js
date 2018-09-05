'use strict';
angular.module('posadminApp')
  .controller('subadminCtrl', function ($scope, $mdDialog,$mdToast, $http,$state,verifyDelete) {
    $scope.username='';
    $scope.adminid='';
    $scope.edit = false;
    $scope.check = ()=>{
        if($scope.username==undefined && $scope.password==undefined)
        $scope.edit=false;
    }
    $scope.getsubadmin = ()=>{
        $http.post('/admin/getsubadmin')
        .then((res)=>{
          console.log(res)
          $scope.subadmins = res.data.result
        })
    };$scope.getsubadmin()
    $scope.addsubadmin = ()=>{
        $http.post('/admin/addsubadmin',{username:$scope.username,password:$scope.password,edit:$scope.edit,id:$scope.adminid})
        .then((res)=>{
          console.log(res)
          $scope.username = undefined;
          $scope.password = undefined;
          $scope.edit = false;
          $scope.getsubadmin();
          $scope.success(res.data.msg);
        }).catch((err)=>{
          console.log(err)
          $scope.error(err.data.err)
        })
    }
    $scope.deletesubadmin = (id)=>{
        verifyDelete(id).then(()=> {
        $http.post('/admin/deletesubadmin',{id:id})
        .then((res)=>{
            $scope.getsubadmin();
        })
    })
    }
    $scope.editadmin = (id,username)=>{
        $scope.username = username
        $scope.adminid = id
        $scope.edit = true
    }
    
    $scope.success=function(msg){
        
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
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
  }).factory('verifyDelete',['$mdDialog', function($mdDialog) {
    return function(id) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure!, Do you want to Delete')
        .content('')
        .ariaLabel('Delete')
        .ok('Ok')
        .cancel('Cancel');
      return $mdDialog.show(confirm);
    }
    }]);