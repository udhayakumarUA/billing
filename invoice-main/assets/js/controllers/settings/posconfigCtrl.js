angular.module('posApp')
  .controller('PosconfigCtrl', function($scope,$http,$location,$mdDialog,verifyDelete,$mdToast) {
   $scope.item = [];
   //search
   $scope.search=function (searchtext) {
     return $http
       .post('/contact/searchcontacttype',{type:"Customer",searchtext:searchtext})
         .then(function (res) {
          console.log(res)
           return res.data.result;
         }).catch(function (err) {
           return [];

         })
   }

    $http.post('/posconfig/poscount').then(function(res){
      console.log(res);
      $scope.poscount = res.data.poscount;
    })
   $http.post('/posconfig/getconfig').then(function(res){

    $scope.selectedcustomer = res.data.result;
    $scope.description = res.data.description;
    $scope.terms = res.data.terms;
    $scope.header = res.data.header;

    })
    $scope.addposconfig = function(){
     $http.post('/posconfig/adddisc',{description:$scope.description,terms:$scope.terms}).then(function(res){
       $scope.success();
     })
    }
  $scope.addposcustomer = function(){

      $http.post('/posconfig/adddisc',{id:$scope.selectedcustomer.id,description:$scope.description,terms:$scope.terms}).then(function(res){
        $scope.success();
      })
   }

    $scope.startinvoice = function(){
      $http.post('/posconfig/startinvoice',{header:$scope.header}).then(function(res){
        $scope.success();
      })
    }



    $scope.success = function(msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Updated Successfully')
          .position('top right')
          .theme('success-toast')
          .hideDelay(1000)
      );
    };

  })
