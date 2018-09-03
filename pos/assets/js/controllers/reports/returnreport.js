angular.module('posApp')
    .controller('ReportreturnCtrl', function ($scope, $http, verifyDelete, $mdToast, $filter) {
        //Getting Expense By Category
        $scope.hidedate=true;
        $scope.getreport = function () {
            var startdate=$filter('date')($scope.startdate, 'yyyy-MM-dd')
            var enddate=$filter('date')($scope.enddate, 'yyyy-MM-dd')
            $scope.hidedate=false
            $http.post('/returnproduct/getreport', { startdate:startdate, enddate:enddate }).then(function (res) {
                $scope.returns=res.data.returns;
            })
        }
    //get Sale return report 
        $scope.getsalereturn =function(){
          console.log('enters')
          var startdate=$filter('date')($scope.startdate, 'yyyy-MM-dd')
          var enddate=$filter('date')($scope.enddate, 'yyyy-MM-dd')
          $scope.hidedate=false
          $http.post('/salereturn/salereport', { startdate:startdate, enddate:enddate }).then(function (res) {
            console.log(res)  
            $scope.showdate = false
            $scope.salereturns=res.data.data;
            $scope.amount = res.data.totalreturn[0]
          })
        }
        //get purchase return report 
        $scope.getpurchasereturn =function(){
          console.log('enters')
          var startdate=$filter('date')($scope.startdate, 'yyyy-MM-dd')
          var enddate=$filter('date')($scope.enddate, 'yyyy-MM-dd')
          $scope.hidedate=false
          $http.post('/return/salereport', { startdate:startdate, enddate:enddate }).then(function (res) {
            console.log(res)  
            $scope.showdate = false
            $scope.salereturns=res.data.data;
            $scope.amount = res.data.totalreturn[0]
          })
        }
    //sale return report by item
        $scope.getsalereturnitems = function () {
          console.log('returnbyitem')
          var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
          var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
          $http.post('/salereturn/returnbyitem', { startdate: date, enddate: date1 }).then(function (res) {
            console.log(res);
            $scope.amount = res.data.amount[0];
            $scope.items = res.data.result;
            $scope.showdate = false
            var gettotalsub = 0;
            var gettotalcgst = 0;
            var gettotalsgst = 0;
            var gettotaligst = 0;
            var gettotalcess = 0;
            var getmaintotal = 0;
            for(var i = 0; i < $scope.items.length; i++){
              var items = $scope.items[i];
              gettotalsub += (items.totalsub);
              gettotalcgst += (items.totalcgst);
              gettotalsgst += (items.totalsgst);
              gettotaligst += (items.totaligst);
              gettotalcess += (items.totalcess);
            }
            $scope.gettotalsub = gettotalsub;
            $scope.gettotalcgst = gettotalcgst;
            $scope.gettotalsgst = gettotalsgst;
            $scope.gettotaligst = gettotaligst;
            $scope.gettotalcess = gettotalcess;
          });
        }
    //purchase return by items
    $scope.getreturnitems = function () {
      console.log('returnbyitem')
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/return/returnbyitem', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.items = res.data.result;
        $scope.showdate = false
        var gettotalsub = 0;
        var gettotalcgst = 0;
        var gettotalsgst = 0;
        var gettotaligst = 0;
        var gettotalcess = 0;
        var getmaintotal = 0;
        for(var i = 0; i < $scope.items.length; i++){
          var items = $scope.items[i];
          gettotalsub += (items.totalsub);
          gettotalcgst += (items.totalcgst);
          gettotalsgst += (items.totalsgst);
          gettotaligst += (items.totaligst);
          gettotalcess += (items.totalcess);
        }
        $scope.gettotalsub = gettotalsub;
        $scope.gettotalcgst = gettotalcgst;
        $scope.gettotalsgst = gettotalsgst;
        $scope.gettotaligst = gettotaligst;
        $scope.gettotalcess = gettotalcess;
      });
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