// let print_win;
angular.module('posApp')
  .controller('singlesalesorderCtrl', function ($scope, $http, $stateParams, $location, verifyDelete, $mdToast) {
    $scope.rows = 20;
    $scope.count = 0;
    $scope.currentpage = 1;
    $scope.pointofsale = [];
    $scope.searchtext = '';
    $scope.statustype = 'All';
    $scope.printerready=false;
    $scope.defaulturl='';

    $http.post('/salesorder/getid').then(function (res) {
      console.log(res)
      $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
        console.log(res)
        $scope.user = res.data.user;
      })
      $scope.salesorders = res.data.result
      $scope.count=res.data.count
      $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
    });

    $http.post('/salesorder/Salesorderbyid', { id: $stateParams.id }).then(function (res) {
      console.log(res)
      $scope.details = res.data.result
       $scope.default=res.data.template;
       if($scope.default) {
         $scope.defaulturl = $scope.default.url + $stateParams.id;
         console.log('defaulturl')
       }
       else{
         $scope.defaulturl='http://localhost:1349/salesordera4/'+$stateParams.id
       }
    })

    //This trigger the main electron app to print the content in the printer
    $scope.print=function(){
      console.log('print')
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('printordownload', 'print',$scope.defaulturl);
    }

    //This is to download the page details in the templete selected.
    //NOTE:It works only in electron app not in the browsers
    $scope.downloadpdf=function(name){
      // const ipcRenderer = require('electron').ipcRenderer;
      // ipcRenderer.send('salesorderprint', 'download',$scope.defaulturl,name);
      // $scope.success('Downloaded in the desktop')
    }

    // getmore
    $scope.more = function () {
      if ($scope.searchtext == '') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salesorder/getall', { skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          console.log(res)
          $scope.salesorders = res.data.result;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salesorder/searchSalesorder', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.salesorders = res.data.result;
        })
      }
    };

    //search
    $scope.search = function (searchtext) {
      $scope.currentpage = 1;
      $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
      $http.post('/salesorder/searchSalesorder', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
        console.log(res)
        $scope.count = res.data.count;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.salesorders = res.data.result;
      })
    };


    //limit
    $scope.changevalue = function () {
      if ($scope.searchtext == '') {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salesorder/getall', { skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.salesorders = res.data.result;
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
      }
      else {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salesorder/searchSalesorder', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
          $scope.salesorders = res.data.result;
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
      }
    }

    //delete
    $scope.delete = function (id) {
      verifyDelete(id).then(function () {
        $http.post('/salesorder/deleteSalesorder', { id: id }).then(function (res) {
          console.log(res);
          $location.path('/salesorder');
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
