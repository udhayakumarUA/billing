angular.module('posApp')
  .controller("dashboardCtrl", ["$scope", 'config', '$rootScope','$http','$filter',
    function ($scope, config,$rootScope,$http,$filter, $state) {

      $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
      $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
      ];
      $scope.colors = ['#FDB45C', '#949FB1'];
      $scope.series = ['Series A', 'Series B'];

      $scope.labels1 = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
      $scope.data1 = [300, 500, 100];
      $scope.series1 = ['Series A', 'Series B'];

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
        console.log(res.data.stocks)
        $scope.stocks = res.data.stocks;
      })
      $http.post('/expense/getexpense').then(function (res) {
        $scope.expenses = res.data.expenses;
      });

    //To get the overduepayment from the pos api
    $http.post('/overdue/getoverduepayment',{date:startdate}).then(function (res) {
      console.log('-------------------------')
      console.log(res)
      $scope.overdue = res.data.overdue
    })




    }]);
