// let print_win;
angular.module('posApp')
  .controller('EstimatepageCtrl', function ($scope, $http, $stateParams, $location,$filter, verifyDelete, $mdToast) {
    $scope.rows = 20;
    $scope.count = 0;
    $scope.currentpage = 1;
    $scope.pointofsale = [];
    $scope.searchtext = '';
    $scope.statustype = 'All';
    $scope.printerready=false;
    $scope.defaulturl='';
    var enddate=$filter('date')(new Date(), 'yyyy-MM-dd');
    console.log(enddate);
    $http.post('/estimate/getid',{enddate:enddate}).then(function (res) {
      console.log(res)
      $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
        console.log(res)
        $scope.user = res.data.user;
      })

      $scope.estimates = res.data.result
      $scope.count = res.data.count
      var value = res.data.id.toString()
      $scope.estimateid = 'EXT-' + value.padStart(7, 0);
      $scope.estid = res.data.id
      $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
    });

    $http.post('/estimate/estimatebyid', { id: $stateParams.id }).then(function (res) {
      console.log(res)
      $scope.details = res.data.result
      $scope.default=res.data.template;
      if($scope.default) {
        $scope.defaulturl = $scope.default.url + $stateParams.id
      }
      else{
        $scope.defaulturl='http://localhost:1349/estimatea4/'+$stateParams.id
      }
    })

    $scope.print=function(){
      console.log('print')
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('printordownload', 'print',$scope.defaulturl);
    }
    $scope.downloadpdf=function(name){
      console.log('downloaddata')      
      const ipcRenderer = require('electron').ipcRenderer;
      ipcRenderer.send('printordownload', 'download',$scope.defaulturl,name);
      $scope.success('Downloaded in the desktop')
    }
    
    //getmore
    $scope.more = function () {
      if ($scope.searchtext == '') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/estimate/getall', { skip: $scope.skip, limit: $scope.rows, category: $scope.statustype }).then(function (res) {
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

    //delete
    $scope.delete = function (id) {
      verifyDelete(id).then(function () {
        $http.post('/estimate/deleteestimate', { id: id }).then(function (res) {
          console.log(res);
          $location.path('/estimatepage');
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
