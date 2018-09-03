angular.module('posApp')
  .controller('purchaseorderlistCtrl', function($scope,$http,verifyDelete,$mdToast,$stateParams,$location) {
    $scope.rows = 20;
    $scope.count = 0;
    $scope.currentpage = 1;
    $scope.pointofsale = [];
    $scope.searchtext = '';
    $scope.statustype = 'All';
    $scope.printerready=false;


    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      $scope.user = res.data.user;
    })

    $http.post('/purchaseorder/getid').then(function (res) {
      $scope.purchaseorders = res.data.result
      $scope.count = res.data.count
      $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
    });

    $http.post('/purchaseorder/purchasebyid', { id: $stateParams.id }).then(function (res) {
      console.log(res)
      $scope.details = res.data.result
      $scope.default=res.data.template;
    })

    $scope.print=function(){
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('asynchronous-message', 'print');
    }
    //getmore
    $scope.more = function () {
      if ($scope.searchtext == '') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/purchaseorder/getall', { skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.purchaseorders = res.data.result;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/purchaseorder/searchpurchase', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.purchaseorders = res.data.result;
        })
      }
    };

    //search
    $scope.search = function (searchtext) {
      $scope.currentpage = 1;
      $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
      $http.post('/purchaseorder/searchpurchase', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
        $scope.count = res.data.count;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.purchaseorders = res.data.result;
      })
    };


    //limit
    $scope.changevalue = function () {
      if ($scope.searchtext == '') {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/purchaseorder/getall', { skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.purchaseorders = res.data.result;
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
      }
      else {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/purchaseorder/searchpurchase', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.purchaseorders = res.data.result;
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
      }
    }

    //delete
    $scope.delete = function (id) {
      verifyDelete(id).then(function () {
        $http.post('/purchaseorder/deletepurchase', { id: id }).then(function (res) {
          console.log(res);
          $location.path('/purchaseorderlist');
        })

      })
    };
    $scope.success = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
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

