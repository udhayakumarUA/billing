angular.module('posApp')
 .controller('useroleCtrl', function($scope, $mdDialog,verifyDelete,$http,$mdToast) {
 	 $scope.status = '  ';
  $scope.customFullscreen = false;
  $http.post('/user/getallusers').then(function(res){
    console.log(res)
    $scope.users=res.data.users;
  })
   $scope.addUser = function(ev) {
    $mdDialog.show({
      controller: AdduserController,
      templateUrl: 'templates/settings/dialogs/adduser.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(users) {
      $scope.users = users;
    });
  };

   $scope.delete=function(id){
     verifyDelete(id).then(function() {
       console.log('deleted')
       $http.post('/user/deleteuser',{id:id}).then(function(res){
       $scope.users=res.data.users;
       $scope.success()
       })
     })
   }
   $scope.success = function(msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Deleted Successfully')
          .position('top right')
          .theme('success-toast')
          .hideDelay(1000)
      );
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

   function AdduserController($scope, $mdDialog,$mdToast) {

$scope.adduser=function () {
  $http.post('/user/adduser',{username:$scope.username,password:$scope.password,role:$scope.role}).then(function (res) {
    $mdDialog.hide(res.data.users);
  }).catch(function (err) {
    $scope.error(err.data.err)
  })
}
$scope.success = function(msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Added Successfully')
          .position('top right')
          .theme('success-toast')
          .hideDelay(1000)
      );
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
    
     $scope.cancel = function() {
       $mdDialog.cancel();
     };



   }
  $scope.editUser = function(ev,id) {
    $mdDialog.show({
      controller: EditController,
      templateUrl: 'templates/settings/dialogs/edituser.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{id:id},
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(user) {
    });
  };
  function EditController($scope, $mdDialog,id,$mdToast) {
    $scope.update=function(){
      $http.post('/user/updateroleuser',{id:id,password:$scope.password}).then(function(res){
        $mdDialog.hide()
      })
      $scope.success()
    }
    $scope.success = function(msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Updated Successfully')
          .position('top right')
          .theme('success-toast')
          .hideDelay(1000)
      );
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

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
