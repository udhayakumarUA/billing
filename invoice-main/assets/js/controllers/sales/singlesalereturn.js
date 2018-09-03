angular.module('posApp')
  .controller('singlesalereturnCtrl', function($scope,$http,$stateParams,verifyDelete,$mdToast,$state) {
    $scope.disable=false;
    $http.post('/salereturn/singlereturn',{sid:$stateParams.sid}).then(function (res) {
      console.log(res)
      $scope.return=res.data.returns;
      if(res.data.returns.status=='Draft'){
        $scope.disable=false;
      }
      else{
        $scope.disable=true;
      }
    });
    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      console.log(res)
      $scope.user = res.data.user;
    })
    $scope.delete=function(id){
      verifyDelete(id).then(function() {
        $http.post('/salereturn/deletebill',{id:id}).then(function (res) {
          $state.go('salereturnlist')
          $scope.success('Deleted Successfully')
        })
      })
    };
    $scope.success = function(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
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

