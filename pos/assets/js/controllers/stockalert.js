let print_win;
angular.module('posApp')
  .controller('StockalertCtrl', function ($scope, $http, $stateParams, $location, verifyDelete, $mdToast) {
    $scope.stovks=[];
    $scope.skip=0;
    $scope.noMore = true;
    $scope.count=1;
    $http.post('/products/getinventoryalert').then(function (res) {
      console.log(res)
      $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
        console.log(res)
        $scope.user = res.data.user;
      })
      $scope.stocks = res.data.stocks;
      $scope.count=res.data.stocks.length;
      $scope.skip = $scope.skip+=10;
      if ($scope.count < 11 ){
        $scope.noMore = true;
      }
      else{$scope.noMore = false;}
    });
    //getmore
    $scope.more = function () {
      if ($scope.searchtext == '') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post(' /products/getmoreinventoryalert', { skip: $scope.skip}).then(function (res) {
          console.log(res)
          $scope.estimates = res.data.result;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/estimate/searchestimate', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.estimates = res.data.result;
        })
      }
    };

    //search
    $scope.search = function (searchtext) {
      $scope.currentpage = 1;
      $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
      $http.post('/estimate/searchestimate', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
        $scope.count = res.data.count;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.estimates = res.data.result;
      })
    };


    //limit
    $scope.changevalue = function () {
      if ($scope.searchtext == '') {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/estimate/getall', { skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.estimates = res.data.result;
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
      }
      else {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/estimate/searchestimate', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.estimates = res.data.result;
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
      }
    }
  }).factory('verifyDelete', ['$mdDialog', function ($mdDialog) {
    return function (id) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure!, Do you want to Delete')
        .content('')
        .ariaLabel('Delete')
        .ok('Ok')
        .cancel('Cancel');
      return $mdDialog.show(confirm);
    }
  }]);