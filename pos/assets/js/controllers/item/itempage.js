angular.module('posApp')
  .controller('ItempageCtrl', function($scope, $mdToast,$state,$http,Upload) {
    $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.collections=[];
    $scope.searchtext='';
    $http.post('/products/getproducts').then(function (res) {
      console.log(res)
      $scope.count=res.data.count;
      $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
      console.log(Math.ceil($scope.count/parseInt($scope.rows)))
    });

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

    //getdata
    $scope.more=function () {
      if($scope.searchtext=='') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/products/moreproducts', {skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.products = res.data.products;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/collection/searchcollections', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.products = res.data.products;
        })
      }
    };

    //search
    $scope.search=function (searchtext) {
      $scope.currentpage=1;
      $scope.skip=(($scope.currentpage-1)*parseInt($scope.rows));
      $http.post('/products/searchproducts',{searchtext:searchtext,skip:$scope.skip,limit:$scope.rows}).then(function (res) {
        $scope.count=res.data.count;
        $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
        $scope.products=res.data.products;
      })
    }


//limit
    $scope.changevalue=function () {
      if($scope.searchtext=='') {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/products/moreproducts', {skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.products = res.data.products;
        });
      }
      else{
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/products/searchproducts', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.products = res.data.products;
        });
      }
    }
  })
