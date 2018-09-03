angular.module('posApp')
  .controller('OverduePayment', function ($scope, $http, $stateParams, $location, verifyDelete, $mdToast) {
    $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.searchtext='';
    (()=>{
      $http.post('/overdue/getoverduepayment').then((res)=>{
        $scope.overdues = res.data.overdue
        $scope.count = res.data.count
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));

      })
    })()
    $scope.more = function () {
        if ($scope.searchtext == '') {
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post('/overdue/getoverduepayment', { skip: $scope.skip, limit: $scope.rows}).then(function (res) {
            console.log(res)
            $scope.overdues = res.data.overdue;
          })
        }
        else {
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post('/overdue/searchOverDuePayment', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows}).then(function (res) {
            $scope.overdues = res.data.overdue;
          })
        }
      };
  
       //search
       $scope.search = function (searchtext) {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/overdue/searchOverDuePayment', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows,}).then(function (res) {
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
          $scope.overdues = res.data.overdue;
        })
      };
  
        //limit
        $scope.changevalue = function () {
          if ($scope.searchtext == '') {
            $scope.currentpage = 1;
            $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
            $http.post('/overdue/getoverduepayment', { skip: $scope.skip, limit: $scope.rows}).then(function (res) {
              $scope.overdues = res.data.overdue;
              $scope.count = res.data.count;
              $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
            });
          }
          else {
            $scope.currentpage = 1;
            $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
            $http.post('/overdue/searchOverDuePayment', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows}).then(function (res) {
              $scope.overdues = res.data.overdue;
              $scope.count = res.data.count;
              $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
            });
          }
        }



  });