angular.module('posApp')
  .controller('purchaseordersingleCtrl', function($scope,$http,$stateParams,verifyDelete,$mdToast,$state) {
    $scope.disable=false;

    $scope.delete=function(id){
      verifyDelete(id).then(function() {

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

