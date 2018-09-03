angular.module('posApp')
  .controller("dashboardCtrl", ["$scope", 'config', '$rootScope','$http','$filter',
    function ($scope, config,$rootScope,$http,$filter, $state) {
      
      $scope.myValues = [[0,2,3,4],[9,6,4,3]];
      $scope.myObj = {
        backgroundColor : "white",
        series:[
          {
            lineColor:"#900000",
            marker:{
              backgroundColor:"#dc3737",
              borderWidth:1,
              shadow:0,
              borderColor:"#f56b6b"
            }
          },
          {
            lineColor:"#efe634",
            marker:{
              backgroundColor:"#fff41f",
              borderWidth:1,
              shadow:0,
              borderColor:"#fdffc0"
            }
          },
        ]
      };

      $scope.myJson = {
        type : "bar",
        title:{
          backgroundColor : "transparent",
          fontColor :"black",
          text : ""
        },
        backgroundColor : "white",
        series : [
          {
            values : [10000,2000,3000,100,2000,3332,222,888,233,],
            backgroundColor : "#4DC0CF"
          }
        ]
      };

      /*$scope.addValues = function(){
        var val = Math.floor((Math.random() * 10));
        console.log(val);
        $scope.myJson.series[0].values.push(val);
      };*/

      $scope.myJson1 = {
        type : "bar",
        title:{
          backgroundColor : "transparent",
          fontColor :"black",
          text : "Hello world"
        },
        backgroundColor : "white",
        series : [
          {
            values : ['u1','u2','u3','u4'],
            backgroundColor : "#4DC0CF"
          }
        ]
      };

      /*$scope.addValues1 = function(){
        var val = Math.floor((Math.random() * 100));
        console.log(val);
        $scope.myJson1.series[0].values.push(val);
      }*/
      $scope.date= new Date();
      var startdate=$filter('date')($scope.date, 'yyyy-MM-dd')
      $http.post('pos/sale',{startdate:startdate,enddate:startdate}).then(function(res){
        console.log(res);
        $scope.bill = res.data;
      })

      $http.post('purchase/getpurchase').then(function(res){
        $scope.purchase = res.data.purchase;
      })

      $http.post('pos/getpos').then(function(res){
        $scope.pointofsale = res.data.pos;
      })

      $http.post('/products/getstock').then(function (res) {
        $scope.inventory = res.data.inventory;
      })
      $http.post('/products/getinventoryalert').then(function (res) {
        $scope.stocks = res.data.stocks;
      })

      $http.post('/expense/getexpense').then(function (res) {
        $scope.expenses = res.data.expenses;
      });



    }]);
