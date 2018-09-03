angular.module('posApp')
  .controller("TemplatesCtrl", function($scope,$mdToast, $http){
    $scope.possize='posa4';
    $scope.purchasesize='purchasea4';
    $scope.estimatesize='estimatea4';
    $scope.salesordersize='salesordera4'
$http.post('/pos/gettemplates').then(function (res) {
  console.log(res)
  if(res.data.possize) {
    $scope.possize = res.data.possize.size;
  }
  if(res.data.purchasesize) {
    $scope.purchasesize = res.data.purchasesize.size;
  }
  if(res.data.estimatesize) {
    $scope.estimatesize = res.data.estimatesize.size;
  }
  if(res.data.purchaseorderdesize) {
    $scope.purchaseorderdesize = res.data.purchaseorderdesize.size;
  }

  if(res.data.salesordersize) {
    $scope.salesordersize = res.data.salesordersize.size;
  }
})
    $scope.setposdefault=function (url,size,template) {
      $scope.possize=size;
      console.log(url)
      $http.post('/pos/setdefault',{url:url,size:size,template:template}).then(function (res) {
        $scope.success();
      })
    };
    $scope.setpurchasedefault=function (url,size,template) {

      $scope.purchasesize=size;
      console.log(url)
      $http.post('/pos/setdefault',{url:url,size:size,template:template}).then(function (res) {
        $scope.success();
      })
    };
    $scope.setestimatedefault=function (url,size,template) {
      $scope.estimatesize=size;
      console.log(url)
      $http.post('/pos/setdefault',{url:url,size:size,template:template}).then(function (res) {
        $scope.success();
      })
    };

    $scope.setsalesorderdefault=function (url,size,template) {
      $scope.salesordersize=size;
      console.log(url)
      $http.post('/pos/setdefault',{url:url,size:size,template:template}).then(function (res) {
        $scope.success();
      })
    };

    $scope.setpurchaseorderdefault=function (url,size,template) {
      $scope.purchaseorderdesize=size;
      console.log(url)
      $http.post('/pos/setdefault',{url:url,size:size,template:template}).then(function (res) {
        $scope.success();
      })
    };

    $scope.success = function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Default template changed')
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
  });
