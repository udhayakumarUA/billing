angular.module('posApp')
  .controller("bankdetailsCtrl", ['$scope', '$http','$state','Upload','$mdToast', function($scope, $http,$state,Upload,$mdToast) {

    $http.post('/bank/getdetails').then(function (res) {
      console.log(res)
      $scope.bank=res.data.bank[0];
    });

    $scope.updatebank=function (){
      $http.post('/bank/updatebank',{
        bankname: $scope.bank.bankname,
        branchname: $scope.bank.branchname,
        accountno: $scope.bank.accountno,
        accountname: $scope.bank.accountname,
        ifsccode: $scope.bank.ifsccode}).then(function (res) {
          $scope.success();
        }).catch(function (err) {
          $scope.error(err.data.err)
        })
    };

    $scope.error = function(err) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(err)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
    $scope.success = function() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Bank Details Updated')
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
  }]);
