'use strict';

angular.module('posadminApp')
  .controller('NewclientCtrl', function ($scope,$http,$mdToast,$state) {
    $scope.adduser=function () {
      console.log('enter')
      $http.post('/user/adduser',{
        company:$scope.company,
        storeid:$scope.storeid,
        fistname:$scope.fistname,
        lastname:$scope.lastname,
        email:$scope.email,
        username:$scope.username,
        password:$scope.password,
        phoneno:$scope.phoneno,
        mobileno:$scope.mobileno,
        expiredate:$scope.expiredate,
        address:$scope.address,
        city:$scope.city,
        country:$scope.country,
        postalcode:$scope.postalcode,
        type:'offline'}).then(function (res) {
        $scope.company='';
        $scope.storeid='';
        $scope.fistname='';
        $scope.lastname='';
        $scope.email='';
        $scope.username='';
        $scope.password='';
        $scope.phoneno='';
        $scope.mobileno='';
        $scope.expiredate='';
        $scope.address='';
        $scope.city='';
        $scope.country='';
        $scope.postalcode='';
        $scope.success();
        $state.go('pos.offlineusers');
        console.log(res)
      }).catch(function (err) {
        $scope.error(err.data.err)
      })
    }

    $scope.adduser1=function () {
      console.log('enter')
      $http.post('/user/adduser1',{
        company1:$scope.company1,
        fistname1:$scope.fistname1,
        lastname1:$scope.lastname1,
        email1:$scope.email1,
        storeid1:$scope.storeid1,
        username1:$scope.username1,
        password1:$scope.password1,
        phoneno1:$scope.phoneno1,
        mobileno1:$scope.mobileno1,
        expiredate1:$scope.expiredate1,
        address1:$scope.address1,
        city1:$scope.city1,
        country1:$scope.country1,
        postalcode1:$scope.postalcode1,
        type:'online'}).then(function (res) {
        $scope.company1='';
        $scope.storeid1='';
        $scope.fistname1='';
        $scope.lastname1='';
        $scope.email1='';
        $scope.username1='';
        $scope.password1='';
        $scope.phoneno1='';
        $scope.mobileno1='';
        $scope.expiredate1='';
        $scope.address1='';
        $scope.city1='';
        $scope.country1='';
        $scope.postalcode1='';
        $scope.success();
        $state.go('pos.onlineusers');
        console.log(res)
      }).catch(function (err) {
        $scope.error(err.data.err)
      })
    }
    $scope.clearstoreid=function(){
      $scope.usermessage="";
    }
    $scope.checkstoreid=function(){
      if($scope.storeid=="" || !$scope.storeid) {
        return;
      }
      else{
        var checkuserobj={};
        checkuserobj.storeid=$scope.storeid;
        $http.post('/user/checkstoreid',checkuserobj).then(function(resp){
          console.log(resp)
          $scope.usermessage=resp.data.message;
        });
      }
    }
    $scope.clearstoreid1=function(){
      $scope.usermessage1="";
    }
    $scope.checkstoreid1=function(){
      if($scope.storeid1=="" || !$scope.storeid1) {
        return;
      }
      else{
        var checkuserobj={};
        checkuserobj.storeid=$scope.storeid1;
        $http.post('/user/checkstoreid',checkuserobj).then(function(resp){
          console.log(resp)
          $scope.usermessage1=resp.data.message;
        });
      }
    }

    $scope.success=function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('added successfully')
          .position('top right' )
          .hideDelay(3000)
      );
    }
    $scope.error=function(err){
      $mdToast.show(
        $mdToast.simple()
          .textContent(err)
          .position('top right' )
          .hideDelay(3000)
      );
    }
  });
