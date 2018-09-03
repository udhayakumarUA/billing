angular.module('posApp')
 .controller('paymentrecCtrl', function($scope,$stateParams, $mdDialog,$filter,verifyDelete,$http,$mdToast,$state) {
   $scope.blkdate = new Date();
   //For check the request is from the invoice single page through record payment
  if($stateParams.id){
    console.log($stateParams.id)
    $http.post('/pos/singlepos',{posid:$stateParams.id}).then(function (res) {
      $scope.selectedcustomer = res.data.singlecontact
      $scope.billid = res.data.pos.posid
      $scope.getpos($stateParams.id)
    })
  } 
  $scope.delete=function(id){
       verifyDelete(id).then(function() {
         console.log('deleted')
      })
    };
   $scope.search=function (searchtext) {
     return $http
     .post('/pos/searchcontact',{searchtext:searchtext==undefined?'':searchtext})
       .then(function (res) {
         return res.data.result;
       }).catch(function (err) {
         return [];
       })
   };
   $scope.getpos=function (id) {
     $http.post('/pos/singlepos',{posid:id}).then(function (res) {
       console.log(res)
       $scope.poss=res.data.pos;
       $scope.amount=parseFloat($scope.poss.balance)
     })
   }
   //this function to get the bulk payment ammount
   $scope.getpayment=function (id) {
    $http.post('/pos/getpaymentammount',{customerId:id}).then(function (res) {
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
     $http.post('paymentreceived/addpayment',{user:$scope.selectedcustomer.id,
       username:$scope.selectedcustomer.firstname,
       paymentdate:date,
       paymentmode:$scope.paymentmode,
       date:date,
       billid:$scope.billid,
       notes:$scope.notes,
       amount:$scope.amount,
       clientid:localStorage.getItem('clientid')
     }).then(function (res) {
       $state.go('singlereceive',{id:res.data.payid});
       $scope.success('Payment Received Successfully')
     })
   }
   $scope.resetform=(form)=>{
     $scope.form.$setPristine()

   }
   $scope.addBulkPayment=function () { //adding bulk payment
    if($scope.blkamount<=0){
      $scope.success('Ther is no amount to pay')
      return 
    }
    if($scope.blkamount>$scope.totalblkammount){ 
      //checking wether the entered amount is lesser than the total amount
      $scope.success('Amount should not be greater than the total amount')
      return 
    }
    var date = $filter('date')($scope.blkdate, 'yyyy-MM-dd') 

     $http.post('paymentreceived/addbulkpayment',{
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
       $state.go('singlereceive',{id:res.data.payed.paymentid});
       $scope.success('Payment Received Successfully')
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
