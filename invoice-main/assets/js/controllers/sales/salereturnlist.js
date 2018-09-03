angular.module('posApp')
  .controller('salereturnlistCtrl', function($scope,$http,verifyDelete,$mdToast) {
     $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.return=[];
    $scope.searchtext='';
    $scope.statustype='All';

    $http.post('/salereturn/getreturncount').then(function (res) {
      $scope.count=res.data.count;
      $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
    });


    //getmore
    $scope.more=function () {
      if($scope.searchtext=='') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salereturn/getall', {skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          console.log(res)
          $scope.return=res.data.returns;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salereturn/searchreturn', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          $scope.return = res.data.returns;
        })
      }
    };

    //search
    $scope.search=function (searchtext) {
      $scope.currentpage=1;
      $scope.skip=(($scope.currentpage-1)*parseInt($scope.rows));
      $http.post('/salereturn/searchreturn',{searchtext:searchtext,skip:$scope.skip,limit:$scope.rows,category:$scope.statustype}).then(function (res) {
        $scope.count=res.data.count;
        $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
        $scope.return=res.data.returns;
      })
    };


//limit
    $scope.changevalue=function () {
      if($scope.searchtext=='') {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salereturn/getall', {skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          $scope.return=res.data.returns;
          $scope.count=res.data.count;
        });
      }
      else{
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salereturn/searchreturn', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows,category:$scope.statustype}).then(function (res) {
          $scope.return=res.data.returns;
          $scope.count=res.data.count;
        });
      }
    }

    //delete
    $scope.delete=function(ev,id,i){
      verifyDelete(id).then(function() {
        $http.post('/salereturn/deletebill',{id:id}).then(function (res) {
          $scope.return.splice(i,1);
          $scope.count=$scope.count-1;
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

