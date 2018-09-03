angular.module('posApp')
  .controller('SalespersonsingleCtrl', function ($scope, $stateParams, $location, $http, $mdDialog, verifyDelete,$filter ) {

    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      $scope.user  = res.data.user;
    })

    $http.post('/salesperson/getsalesperson', { id:$stateParams.id }).then(function (res) {
      $scope.salesperson  = res.data.salesperson[0];
      console.log(res)
    })





    //Invoices report By Salesperson
    $scope.getreportinvoices = function (startdate,enddate) {
      var date = $filter('date')(startdate, 'yyyy-MM-dd');
      var date1 = $filter('date')(enddate, 'yyyy-MM-dd');
      var id = $stateParams.id;
      $http.post('/pos/getreportinvoices', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.invoices = res.data.result;
      });
    }

    //Invoices report By Salesperson Print
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

    //Sales Order report By Salesperson
    $scope.getreportsalesorder = function () {
      var date = $filter('date')($scope.startdate1, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate1, 'yyyy-MM-dd')
      var id = $stateParams.id;
      $http.post('/salesorder/getreportsalesorder', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount1 = res.data.amount[0];
        $scope.salesorder = res.data.result;
      });
    }
    //Sales Order report By Salesperson Print
    $scope.PrintDiv1 = function () {
      var contents = document.getElementById("dvContents1").innerHTML;
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

    //Estimate Order report By Salesperson
    $scope.getreportestimate = function (startdate2,enddate2) {
      var date = $filter('date')(startdate2, 'yyyy-MM-dd');
      var date1 = $filter('date')(enddate2, 'yyyy-MM-dd');
      var id = $stateParams.id;
      $http.post('/estimate/getreportestimate', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount2 = res.data.amount[0];
        $scope.estimate = res.data.result;
      });
    }

    //Estimate Order report By Salesperson Print
    $scope.PrintDiv2 = function () {
      var contents = document.getElementById("dvContents2").innerHTML;
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



    $scope.exportAction1 = function (option) {
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


  }).factory('verifyDelete', ['$mdDialog', function ($mdDialog) {
  return function (id) {
    var confirm = $mdDialog.confirm()
      .title('Are you sure!, Do you want to Delete')
      .content('')
      .ariaLabel('Delete')
      .ok('Ok')
      .cancel('Cancel');
    return $mdDialog.show(confirm);
  }
}]);
