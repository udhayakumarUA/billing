angular.module('posApp')
  .controller('SingleposCtrl', function($scope,$http,$stateParams,verifyDelete,$mdToast,$mdDialog,$state,$rootScope) {
    $scope.defaulturl='';
    $scope.result='';
    $scope.more='More';
      $http.post('/pos/singlepos',{posid:$stateParams.posid,key:$rootScope.key}).then(function (res) {
      console.log(res);
      $scope.pos=res.data.pos;
      $scope.mainuser=res.data.mainuser;
      $scope.default=res.data.template;
        $scope.result=res.data.result;
      if($scope.default) {
      $scope.defaulturl = $scope.default.url + $stateParams.posid.substr(1, $stateParams.posid.length)
    }
    else{
      $scope.defaulturl='http://localhost:1349/posa4/%23'+$stateParams.posid.substr(1, $stateParams.posid.length)
    }
        for(var j=0; j < $scope.result.length; j++) {
          if($scope.result[j]._id == 5) {
            $scope.totrate5 = $scope.result[j].totalproductrate;
            $scope.totcgst5 = $scope.result[j].singlecgst;
            $scope.totsgst5 = $scope.result[j].singlesgst;
            $scope.totigst5 = $scope.result[j].singleigst;
          }

          else if ($scope.result[j]._id == 12) {
            $scope.totrate12 = $scope.result[j].totalproductrate;
            $scope.totcgst12 = $scope.result[j].singlecgst;
            $scope.totsgst12 = $scope.result[j].singlesgst;
            $scope.totigst12 = $scope.result[j].singleigst;
          }

          else if ($scope.result[j]._id == 18) {
            $scope.totrate18 = $scope.result[j].totalproductrate;
            $scope.totcgst18 = $scope.result[j].singlecgst;
            $scope.totsgst18 = $scope.result[j].singlesgst;
            $scope.totigst18 = $scope.result[j].singleigst;
          }

          else if ($scope.result[j]._id == 28) {
            $scope.totrate28 = $scope.result[j].totalproductrate;
            $scope.totcgst28 = $scope.result[j].singlecgst;
            $scope.totsgst28 = $scope.result[j].singlesgst;
            $scope.totigst28 = $scope.result[j].singleigst;
          }
        }
    })
  console.log($scope.result)

    $scope.print=function(){
      console.log($scope.defaulturl)
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('posloadurl', $scope.defaulturl,'print');
    }

    //delivery
    $scope.delivery = function(ev,id) {
      $mdDialog.show({
        controller: deliveryController,
        templateUrl: 'templates/sales/dialogs/delivery.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals:{id:id},
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function(collection) {
          $scope.collections = collection;
        });

    };

    function deliveryController($scope, $mdDialog,id) {
      $http.post('/pos/singlepos',{posid:$stateParams.posid,key:$rootScope.key}).then(function (res) {
        console.log(res);
        $scope.pos=res.data.pos;
        $scope.mainuser=res.data.mainuser;
        $scope.default=res.data.template;
        $scope.result=res.data.result;
      })

      $scope.deliveryprint=function(){
        const ipcRenderer = require('electron').ipcRenderer;
        $scope.deliveryurl='http://localhost:1349/delivery/%23'+$stateParams.posid.substr(1, $stateParams.posid.length)
        ipcRenderer.send('posloadurl', $scope.deliveryurl,'print');
        $mdDialog.cancel();
      }

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }


    //packing
    $scope.packing = function(ev,id) {
      $mdDialog.show({
        controller: packingController,
        templateUrl: 'templates/sales/dialogs/packing.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals:{id:id},
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function(collection) {
          $scope.collections = collection;
        });

    };

    function packingController($scope, $mdDialog,id) {
      $http.post('/pos/singlepos',{posid:$stateParams.posid,key:$rootScope.key}).then(function (res) {
        console.log(res);
        $scope.pos=res.data.pos;
        $scope.mainuser=res.data.mainuser;
        $scope.default=res.data.template;
        $scope.result=res.data.result;
      })

      $scope.packingprint=function(){
        const ipcRenderer = require('electron').ipcRenderer;
        $scope.deliveryurl='http://localhost:1349/packing/%23'+$stateParams.posid.substr(1, $stateParams.posid.length)
        ipcRenderer.send('posloadurl', $scope.deliveryurl,'print');
        $mdDialog.cancel();
      }

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }


    $scope.downloadpdf=function(name){
      console.log('downloaddata')
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('printordownload', 'download',$scope.defaulturl,name);
      $scope.success('Downloaded in the desktop')
    }

    $scope.delete=function(id){
      verifyDelete(id).then(function() {
        $http.post('/pos/deletebill',{id:id}).then(function (res) {
          $state.go('pointofsale')
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
