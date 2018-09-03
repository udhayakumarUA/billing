angular.module('posApp')
  .controller('PointofsaleCtrl', function($scope,$http,verifyDelete,$mdToast,$filter) {
    $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.pointofsale=[];
    $scope.searchtext='';
    $scope.statustype='All';

    $http.post('/pos/getposcount').then(function (res) {
      console.log(res);
      $scope.count=res.data.count;
      $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
    });
    //getmore
    $scope.more=function () {
      if($scope.searchtext=='') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/pos/getall', {skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          console.log(res)
          $scope.pointofsale=res.data.pointofsales;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/pos/searchpos', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          $scope.pointofsale = res.data.pointofsales;
        })
      }
    };

    //search
    $scope.search=function (searchtext) {
      $scope.currentpage=1;
      $scope.skip=(($scope.currentpage-1)*parseInt($scope.rows));
      $http.post('/pos/searchpos',{searchtext:searchtext,skip:$scope.skip,limit:$scope.rows,category:$scope.statustype}).then(function (res) {
        $scope.count=res.data.count;
        $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
        $scope.pointofsale=res.data.pointofsales;
      })
    };


//limit
    $scope.changevalue=function () {
      if($scope.searchtext=='') {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/pos/getall', {skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          $scope.pointofsale=res.data.pointofsales;
          $scope.count=res.data.count;
        });
      }
      else{
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/pos/searchpos', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          $scope.pointofsale=res.data.pointofsales;
          $scope.count=res.data.count;
        });
      }
    }

    //delete
    $scope.delete=function(ev,id){
      verifyDelete(id).then(function() {
        $http.post('/collection/deletecollection',{id:id,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
          $scope.collections=res.data.collections;
          $scope.count=res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
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
