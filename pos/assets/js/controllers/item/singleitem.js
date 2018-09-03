angular.module('posApp')
  .controller('SingleitemCtrl', function($scope,$state, $mdDialog,verifyDelete,$stateParams,$mdToast,$http) {
    $scope.msg = '';
    $http.post('/products/getsingleproduct',{id:$stateParams.id}).then(function (res) {
      console.log(res)
      $scope.product=res.data.product;
      $scope.available = res.data.product.stockinhand
    });
    $scope.updatestock=function(){
    var remaining=0;

    var remaining=parseInt($scope.available)+(parseInt($scope.stockadjustment));
      console.log(remaining)

      $http.post('/products/addstock',{id:$stateParams.id,stock:remaining}).then(function (res) {
        console.log(res)
        $scope.product=res.data.product;
        $scope.available = res.data.product.stockinhand
        $scope.stockadjustment = '';
        $scope.success('Stock Updated')
     });
    };
    $scope.delete=function(id){
      verifyDelete(id).then(function() {
        $http.post('/products/deleteproduct',{id:id}).then(function (res) {
          $scope.success('Deleted Successfully');
          $state.go('itempage');
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
