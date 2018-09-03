angular.module('posApp')
  .controller('purchasereportCtrl', function ($scope, $http, verifyDelete, $mdToast, $filter) {
    $scope.mode='';
    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      $scope.user = res.data.user;
    })

    $scope.getreportcustomer = function(startdate,enddate){
      console.log('test')
      var date=$filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1=$filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/purchase/reportbycustomer',{startdate:date,enddate:date1}).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.customerreport = res.data.result
        $scope.showdate = false
      });
    },

    $scope.getreport = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/purchase/purchasesbycustomer', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res);
        $scope.reports = res.data.result;
        if(res.data.result.length>=1){
          $scope.grandtotal = res.data.data[0];
        }
        else{
          $scope.grandtotal  = ''
        }
        $scope.showdate = false
      });
    }
    $scope.getpaymentreport = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $scope.showmode=$scope.mode;
      if($scope.mode=='All') var mode='';else var mode=$scope.mode;
      $http.post('/Paymentmade/reportbypaymentmade', { startdate: date, enddate: date1,mode:mode }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.payments = res.data.result
        $scope.showdate = false
      });
    }
     //purchase by items
     $scope.getreportitems = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/purchase/purchasebyitem', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0]
        $scope.items = res.data.result
        $scope.showdate = false
      });
    }
    $scope.exportAction = function (option) {
      console.log(option)
      switch (option) {
        case 'pdf': $scope.$broadcast('export-pdf', {});
          break;
        case 'excel': $scope.$broadcast('export-excel', {});
          break;
        case 'doc': $scope.$broadcast('export-doc', {});
          break;
        case 'csv': $scope.$broadcast('export-csv', {});
          break;
        default: console.log('no event caught');
      }
    }

    $scope.PrintDiv = function () {
      var contents = document.getElementById("dvContents").innerHTML;
      var frame1 = document.createElement('iframe');
      frame1.name = "frame1";
      frame1.style.position = "absolute";
      frame1.style.top = "-1000000px";
      document.body.appendChild(frame1);
      var frameDoc = frame1.contentWindow ? frame1.contentWindow : frame1.contentDocument.document ? frame1.contentDocument.document : frame1.contentDocument;
      frameDoc.document.open();
      frameDoc.document.write('<html><head><title>DIV Contents</title>');
      frameDoc.document.write('</head><body>');
      frameDoc.document.write(contents);
      frameDoc.document.write('</body></html>');
      frameDoc.document.close();
      setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        document.body.removeChild(frame1);
      }, 500);
      return false;
    }

  });
