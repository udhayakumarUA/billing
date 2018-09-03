angular.module('posApp')
  .controller('inventoryCtrl', function ($scope, $http, verifyDelete, $mdToast, $filter) {
    //Declaration of the scope variables
    $scope.myDate = new Date();
    $scope.showdates = true;
    //this function is to get the inventory summery report
    $scope.inventory = function () {
      $http.post('/products/getinventory').then(function (res) {
        $scope.inventory = res.data.inventory
      });
    },
    //this function is for getting the user by the key from the local storage
    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      $scope.user = res.data.user;
    })

    $scope.getinventoryAdjustment = ()=>{
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/products/getinventoryadjustment',{startdate: date, enddate: date1}).then(function (res) {
        console.log(res)
        $scope.inventorys = res.data.result
      });
    }
    //this function is to trigger the printer to print the report 
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

    $scope.exportAction = function (option) {
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

  }).directive('exportTable', function(){
  var link = function ($scope, elm, attr) {
    $scope.$on('export-pdf', function (e, d) {
      elm.tableExport({ type: 'pdf', escape: false });
    });
    $scope.$on('export-excel', function (e, d) {
      elm.tableExport({ type: 'excel', escape: false });
    });
    $scope.$on('export-doc', function (e, d) {
      elm.tableExport({ type: 'doc', escape: false });
    });
    $scope.$on('export-csv', function (e, d) {
      elm.tableExport({ type: 'csv', escape: false });
    });
  }
  return {
    restrict: 'C',
    link: link
  }
});
