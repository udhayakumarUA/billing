angular.module('posApp')
  .controller('paymentmadeCtrl', function($scope, $mdDialog,$filter,verifyDelete,$http,$mdToast,$state) {
    $scope.selectedcustomer='';
    /*$scope.variable='REC-4'*/

    $scope.delete=function(id){
      verifyDelete(id).then(function() {
        console.log('deleted')
      })
    };
    $scope.search=function (searchtext) {
      return $http
        .post('/purchase/searchcontact',{searchtext:searchtext})
        .then(function (res) {
          console.log(res)
          return res.data.result;
        }).catch(function (err) {
          return [];
        })
    };
    $scope.getpurchase=function (id) {
      $http.post('/purchase/singlepurchase',{pid:id}).then(function (res) {
        console.log(res)
        $scope.purchases=res.data.purchase;
        $scope.amount=parseFloat($scope.purchases.balance)
      })
    }

    $scope.addpayment=function () {
      if(!$scope.billid){
        return
      }
      var date = $filter('date')($scope.date, 'yyyy-MM-dd')
      $http.post('paymentmade/addpayment',{user:$scope.selectedcustomer.id,
        username:$scope.selectedcustomer.firstname,
        paymentdate:date,
        paymentmode:$scope.paymentmode,
        billid:$scope.billid,
        amount:$scope.amount,
        notes:$scope.notes,
        clientid:localStorage.getItem('clientid')
      }).then(function (res) {
        console.log(res.data.paymentid.paymentid)
        $state.go('singlepaymade',{id:res.data.paymentid.paymentid});
        $scope.success('Payment Made Successfully');
      })
    }
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
