angular.module('posApp')
    .controller('ReportSalesOrderCtrl', function ($scope, $http, verifyDelete, $mdToast, $filter) {
        
        $scope.getsalereturn =function(){
          console.log('enters')
          var startdate=$filter('date')($scope.startdate, 'yyyy-MM-dd')
          var enddate=$filter('date')($scope.enddate, 'yyyy-MM-dd')
          $scope.hidedate=false
          $http.post('/salesorder/salesorderreport', { startdate:startdate, enddate:enddate }).then(function (res) {
            console.log(res)  
            $scope.showdate = false
            $scope.salesorders=res.data.data;
            $scope.amount = res.data.totalreturn[0]
          })
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
    })