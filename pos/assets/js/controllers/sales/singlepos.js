angular.module('posApp')
  .controller('SingleposCtrl', function($scope,$http,$stateParams,verifyDelete,$mdToast,$state,$rootScope) {
    $scope.defaulturl='';
    $scope.result='';
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
      ipcRenderer.send('posloadurl', $scope.defaulturl);
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
