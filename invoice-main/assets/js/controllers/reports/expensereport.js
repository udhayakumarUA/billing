angular.module('posApp')
    .controller('ReportexpenseCtrl', function ($scope, $http, verifyDelete, $mdToast, $filter) {
      //Getting the expense types to show in the ExpenseSingleCategory Report Page 
      (()=>{
        $http.post('/expense/findexpense').then(function (res) {
          $scope.expensetype = res.data.data
        })    
      })();
      $scope.showdates=true 
      //Getting the data based on the expense type selected by the user
       $scope.getSingleExpenseReport = (startdate,enddate,expensetype)=>{
        $scope.showdates = !$scope.showdates;
        var startdate=$filter('date')(startdate, 'yyyy-MM-dd')
        var enddate=$filter('date')(enddate, 'yyyy-MM-dd')
        $scope.showdates = false;
        $http.post('/expense/getbysinglecategory', { startdate:startdate, enddate:enddate,expensetype:expensetype }).then(function (res) {
            console.log(res)
            $scope.sigleexpenses= res.data.data
            if(res.data.expenses.length>=1){
            $scope.totalamount = res.data.expenses[0].maintotal
            $scope.totaltax = res.data.expenses[0].totaltax
            }
            else{
                $scope.totalamount ='';
                $scope.totaltax  = ''
            }
        })
       }
      //Getting Expense By Category
        $scope.valuebydate = function () {
            var startdate=$filter('date')($scope.startdate, 'yyyy-MM-dd')
            var enddate=$filter('date')($scope.enddate, 'yyyy-MM-dd')
            $scope.showdates = false;
            $http.post('/expense/getbydate', { startdate:startdate, enddate:enddate }).then(function (res) {
                console.log(res)
                $scope.details = res.data.dt
                if(res.data.result.length>=1){
                    console.log(res.data.result[0].length)
                $scope.totalamount = res.data.result[0].maintotal
                $scope.totaltax = res.data.result[0].totaltax
                }
                else{
                    $scope.totalamount ='';
                    $scope.totaltax  = ''
                }
            })
        } 
      $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
        $scope.user = res.data.user;
      })

        $scope.valuebytype = function () {
            var startdate=$filter('date')($scope.startdate, 'yyyy-MM-dd')
            var enddate=$filter('date')($scope.enddate, 'yyyy-MM-dd')
            $scope.showdates = false;
            $http.post('/expense/getbyname', { startdate:startdate, enddate:enddate }).then(function (res) {
                console.log(res)
                $scope.types = res.data.values
                $scope.totalamount = res.data.result[0].amount
                $scope.totaltax = res.data.result[0].tax
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

    });
