angular.module('posApp')
 .controller('paymentrecCtrl', function($scope, $mdDialog,$filter,verifyDelete,$http,$mdToast,$state) {
   $scope.selectedcustomer='';

  $scope.delete=function(id){
       verifyDelete(id).then(function() {
         console.log('deleted')
      })
    };
   $scope.search=function (searchtext) {
     return $http
       .post('/pos/searchcontact',{searchtext:searchtext})
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
