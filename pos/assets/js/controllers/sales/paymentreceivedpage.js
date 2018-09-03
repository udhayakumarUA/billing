angular.module('posApp')
  .controller('PaymentrecpageCtrl', function($scope, $mdDialog,verifyDelete,$http,$mdToast) {
    $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.payments=[];
    $scope.searchtext='';
    $scope.customFullscreen = false;

    $http.post('/paymentreceived/getcount').then(function (res) {
      console.log(res)
      $scope.count=res.data.count;
      $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
    });

    //getmore
    $scope.more=function () {
      if($scope.searchtext=='') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/paymentreceived/getall', {skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.payments = res.data.payments;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/paymentreceived/searchpayments', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.payments = res.data.payments;
        })
      }
    };

    //search
    $scope.search=function (searchtext) {
      $scope.currentpage=1;
      $scope.skip=(($scope.currentpage-1)*parseInt($scope.rows));
      $http.post('/paymentreceived/searchpayments',{searchtext:searchtext,skip:$scope.skip,limit:$scope.rows}).then(function (res) {
        $scope.count=res.data.count;
        $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
        $scope.payments=res.data.payments;
      })
    }


//limit
    $scope.changevalue=function () {
      if($scope.searchtext=='') {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/paymentreceived/getall', {skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.payments = res.data.payments;
        });
      }
      else{
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/paymentreceived/searchpayments', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.payments = res.data.payments;
        });
      }
    }
  });
