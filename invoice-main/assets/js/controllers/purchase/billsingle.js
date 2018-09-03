angular.module('posApp')
  .controller('SinglepurchaseCtrl', function($scope,$http,$stateParams,verifyDelete,$mdToast,$state) {
    $scope.disable=false;
    $scope.more='More';
    $scope.defaulturl='';
    $http.post('/purchase/singlepurchase',{pid:$stateParams.pid}).then(function (res) {
      console.log(res)
      $scope.purchase=res.data.purchase;
      if(res.data.purchase.status=='Draft') $scope.disable=false;
      else $scope.disable=true;
      $scope.default=res.data.template;
      if($scope.default) {
        $scope.defaulturl = $scope.default.url + $stateParams.pid
      }
      else{
        $scope.defaulturl='http://localhost:1349/purchasea4/'+$stateParams.pid
      }

    });
    $scope.print=function(){
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('printordownload', 'print',$scope.defaulturl);
    }
    $scope.downloadpdf=function(name){
      console.log('downloaddata')      
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('printordownload', 'download',$scope.defaulturl,name);
      $scope.success('Downloaded in the desktop')
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

