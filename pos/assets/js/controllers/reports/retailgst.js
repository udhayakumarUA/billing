angular.module('posApp')
  .controller('RetailgstCtrl', function ($scope, $http, verifyDelete, $mdToast, $filter) {

    $scope.getreport=function () {
      var date = $filter('date')($scope.date, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.date1, 'yyyy-MM-dd')
      console.log(date1)
      console.log($scope.tax)
      $http.post('/pos/getretail',{date:date,date1:date1,tax:$scope.tax}).then(function (res) {
        console.log(res)
        $scope.reports=res.data.result;
        $scope.showdate = false
        var gettotalsub = 0;
        var gettotalcgst = 0;
        var gettotalsgst = 0;
        var gettotaligst = 0;
        var gettotalcess = 0;
        var getmaintotal = 0;
        for(var i = 0; i < $scope.reports.length; i++){
          var report = $scope.reports[i];
          gettotalsub += (report.totalsub);
          gettotalcgst += (report.totalcgst);
          gettotalsgst += (report.totalsgst);
          gettotaligst += (report.totaligst);
          gettotalcess += (report.totalcess);
          getmaintotal += (report.maintotal);
        }
        $scope.gettotalsub = gettotalsub;
        $scope.gettotalcgst = gettotalcgst;
        $scope.gettotalsgst = gettotalsgst;
        $scope.gettotaligst = gettotaligst;
        $scope.gettotalcess = gettotalcess;
        $scope.getmaintotal = getmaintotal;
      })
    }

    /*$scope.gettotalsub = function(){

      return gettotalsub;
    }*/

    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      $scope.company = res.data.user.company
    })

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


  });
