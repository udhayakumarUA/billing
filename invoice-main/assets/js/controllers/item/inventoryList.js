angular.module('posApp')
  .controller('InventoryListCtrl', function($scope, $mdToast,$state,$http,Upload) {
    $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.collections=[];
    $scope.searchtext='';

    (()=>{
      //finding all the inventory adjustment from the database
      $http.post('/inventory/getAllInventory',{limit:$scope.rows}).then(function (res) {
        console.log(res)
        $scope.inventorys = res.data.result
        $scope.count = res.data.count
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
      })   

    })();

    $scope.more = function () {
      if ($scope.searchtext == '') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('inventory/getAllInventory', { skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          console.log(res)
          $scope.inventorys = res.data.result;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('inventory/searchInventory', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.inventorys = res.data.result;
        })
      }
    };

     //search
     $scope.search = function (searchtext) {
      $scope.currentpage = 1;
      $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
      $http.post('inventory/searchInventory', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows,}).then(function (res) {
        $scope.count = res.data.count;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.inventorys = res.data.result;
      })
    };

      //limit
      $scope.changevalue = function () {
        if ($scope.searchtext == '') {
          $scope.currentpage = 1;
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post('inventory/getAllInventory', { skip: $scope.skip, limit: $scope.rows}).then(function (res) {
            $scope.inventorys = res.data.result;
            $scope.count = res.data.count;
            $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
          });
        }
        else {
          $scope.currentpage = 1;
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post('inventory/searchInventory', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows}).then(function (res) {
            $scope.inventorys = res.data.result;
            $scope.count = res.data.count;
            $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
          });
        }
      }

    $scope.exportAction = function (option) {
      switch (option) {
        case 'pdf': $scope.$broadcast('export-pdf', {});
          break;
        case 'excel': $scope.$broadcast('export-excel', {});
          break;
        case 'doc': $scope.$broadcast('export-doc', {});
          break;
        case 'csv': $scope.$broadcast('export-csv', {});
          break;
        default: console.log('no event caught');
      }
    }

  })
