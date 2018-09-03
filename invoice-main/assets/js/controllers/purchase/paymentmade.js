angular.module('posApp')
  .controller('paymentmadeCtrl', function($scope,$stateParams, $mdDialog,$filter,verifyDelete,$http,$mdToast,$state) {
   
   $scope.blkdate = new Date();
    
    /*$scope.variable='REC-4'*/

    //For check the request is from the purchase bill single page through record payment
    if($stateParams.id){
      console.log($stateParams.id)
      $http.post('/purchase/singlepurchase',{pid:$stateParams.id}).then(function (res) {
        $scope.selectedcustomer = res.data.singlecontact
        $scope.billid = res.data.purchase.purchaseid
        $scope.getpurchase($stateParams.id)
      })
    } 
    $scope.delete=function(id){
      verifyDelete(id).then(function() {
        console.log('deleted')
      })
    };
    $scope.search=function (searchtext) {
      return $http
        .post('/purchase/searchcontact',{searchtext:searchtext==undefined?'':searchtext})
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
        $scope.amount=parseFloat($scope.purchases.balance.toFixed(2))
      })
    }
     //this function to get the bulk payment ammount
   $scope.getpayment=function (id) {
     console.log(id)
    $http.post('/purchase/getpaymentammount',{userid:id}).then(function (res) {
      console.log(res)
      // $scope.poss=res.data.pos;
      $scope.bulckPaymentData = res.data.amount.length>0?res.data.amount[0].balance:0
      $scope.totalblkammount = parseFloat($scope.bulckPaymentData.toFixed(2))
      $scope.blkamount=$scope.totalblkammount
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
    $scope.addBulkPayment=function () { //adding bulk payment
          if($scope.blkamount<=0){
            $scope.success('Amount should be greater than Zero')
            return 
          }
          if($scope.blkamount>$scope.totalblkammount){ 
            //checking wether the entered amount is lesser than the total amount
            $scope.success('Amount should not be greater than the total amount')
            return 
          }
          var date = $filter('date')($scope.blkdate, 'yyyy-MM-dd') 
      
            $http.post('paymentmade/addbulkpayment',{
              user:$scope.selectedcustomer.id,
              username:$scope.selectedcustomer.firstname,
              paymentdate:date,
              paymentmode:$scope.blkpaymentmode,
              date:date,
              notes:$scope.blknotes,
              amount:$scope.blkamount,
              clientid:localStorage.getItem('clientid')
            }).then(function (res) {
              console.log(res)
              $state.go('singlepaymade',{id:res.data.payed.paymentid});
              $scope.success('Payment Made Successfully')        
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
