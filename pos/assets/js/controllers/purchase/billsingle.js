angular.module('posApp')
  .controller('SinglepurchaseCtrl', function($scope,$http,$stateParams,verifyDelete,$mdToast,$state) {
    $scope.disable=false;
    $http.post('/purchase/singlepurchase',{pid:$stateParams.pid}).then(function (res) {
      console.log(res)
      $scope.purchase=res.data.purchase;
      if(res.data.purchase.status=='Draft'){
        $scope.disable=false;
      }
      else{
        $scope.disable=true;
      }
      
    });
    $scope.print=function(){
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('asynchronous-message', 'print');
    }
   
    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      console.log(res)
      $scope.user = res.data.user;
    })
    $scope.delete=function(id){
      verifyDelete(id).then(function() {
        $http.post('/purchase/deletebill',{id:id}).then(function (res) {
          $state.go('purchasebill')
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

