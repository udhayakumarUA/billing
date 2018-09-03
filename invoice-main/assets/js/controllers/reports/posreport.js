angular.module('posApp')
  .controller('ReportposCtrl', function ($scope, $http, verifyDelete, $mdToast, $filter) {
    $scope.mode='';
    $scope.rowprice = [];
    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      $scope.company = res.data.user.company;
      $scope.address = res.data.user.address;
      $scope.address1 = res.data.user.address1;
      $scope.gstin = res.data.user.gstin;
    })
    //sale by customer report and customer balance
    $scope.getreport = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/pos/salebycustomer', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res);
        $scope.reports = res.data.result;
        if (res.data.result.length >= 1) {
          console.log(res.data.result[0].length)
          $scope.grandtotal = res.data.data[0];
        }
        else {
          $scope.grandtotal = ''
        }
        $scope.showdate = false
      });
    }
    //get customer
    $http.post('/user/getallusers',{type:'All'}).then(function (res) {
      console.log(res)
      $scope.customers=res.data.users;
    });

    //sale by items
    $scope.getreportitems = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/pos/reportbyitem', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0]
        $scope.items = res.data.result
        $scope.showdate = false
      });
    }
    //GST sale report
    $scope.getreportcustomer = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/pos/reportbycustomer', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.customerreport = res.data.result
        $scope.showdate = false
      });
    }
    //DETAILED GST REPORT
    $scope.getdetailedreport = function () {
      $scope.submitbutton = true;      
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/pos/detailedgst', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res);
        $scope.detailedgst = res.data.result
        $scope.detailedgst.filter(fil=>{
          if(fil.cgstp.length>1){
             fil.salep=fil.cgstp.map(arr=>({tax:arr.cgst,total:0,totaltax:0}))
             fil.products.filter(pro=>{
               fil.salep.filter(sale=>{
                 if(sale.tax==pro.cgst) {
                   sale.total+=(pro.subtotal-parseFloat(pro.subtax))
                    sale.totaltax +=pro.subtotal
                  }
               })
             })
          }
          else if(fil.igstp.length>1){
            fil.salep=fil.igstp.map(arr=>({tax:arr.igst,total:0,totaltax:0}))
            fil.products.filter(pro=>{
              fil.salep.filter(sale=>{
                if(sale.tax==pro.igst) {
                  sale.total+=(pro.subtotal-parseFloat(pro.subtax))
                  sale.totaltax +=pro.subtotal 
                }          
                })
            })
          }
          else{
            fil.salep = [{tax:0,total:fil.totalsub,totaltax:fil.maintotal}]
          }
        })
        console.log($scope.detailedgst[0].salep)
        $scope.showdate = false
        $scope.submitbutton = false

      });
    }
       //sale by user report
       $scope.getreportuser = function () {
         console.log('enters')
        var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
        var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
        $http.post('/pos/reportbyuser', { startdate: date, enddate: date1,id:$scope.contact }).then(function (res) {
          console.log(res);
          $scope.amount = res.data.amount[0];
          $scope.customerreport = res.data.result
          $scope.showdate = false
        });
      }
    //Day Book Report report
    $scope.getdaybookreport = function () {
        var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
        var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
        $http.post('/pos/daybookreport', { startdate: date, enddate: date1 }).then(function (res) {
          console.log(res);
          // $scope.amount = res.data.amount[0];
          // $scope.customerreport = res.data.result
          $scope.totalsale = res.data.totalsale[0]==undefined?0:res.data.totalsale[0].maintotal;
          $scope.received = res.data.received[0]==undefined?0:res.data.received[0].amount;
          $scope.salebalance=res.data.totalsale[0]==undefined?0:res.data.totalsale[0].balance;
          $scope.totalpurchase = res.data.totalpurchase[0]==undefined?0:res.data.totalpurchase[0].maintotal;
          $scope.paid = res.data.paid[0]==undefined?0:res.data.paid[0].amount;
          $scope.puchasebalance=res.data.totalpurchase[0]==undefined?0:res.data.totalpurchase[0].balance;
          $scope.saledata = res.data.sale;
          $scope.purchasedata = res.data.purchase;
          $scope.expense = res.data.expense[0]==undefined?0:res.data.expense[0].tax;
          $scope.purchasereturn = res.data.purchasereturn[0]==undefined?0:res.data.purchasereturn[0].maintotal;
          $scope.salereturn = res.data.salereturn[0]==undefined?0:res.data.salereturn[0].maintotal;
          $scope.showdate = false
        });
    }
    //profit or loss statement
    $scope.profitorloss = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $http.post('/pos/profitlossreport', { startdate: date, enddate: date1 }).then(function (res) {
        console.log(res)
        $scope.saleprofit = res.data.sale
        $scope.sale =$scope.saleprofit.maintotal-($scope.saleprofit.shipping+ $scope.saleprofit.adjustment-$scope.saleprofit.discount)
        $scope.purprofit = res.data.purchase
        $scope.expprofit = res.data.expense
        $scope.expensetotal = res.data.expensetotal
        $scope.grossprofit= $scope.saleprofit.maintotal - ($scope.purprofit.length>=1?$scope.purprofit[0].maintotal:0)
        $scope.operationalprofit =  $scope.grossprofit - $scope.expensetotal
        $scope.showdate = false
      });
  }

    $scope.getpaymentreport = function () {
      var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
      $scope.showmode=$scope.mode
      if($scope.mode=='All') var mode='';else var mode=$scope.mode;
      $http.post('/paymentreceived/reportbypayment', { startdate: date, enddate: date1,mode:mode }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.payments = res.data.result
        $scope.showdate = false
      });
    }
    //sale by bill
    // $scope.getbill = function () {
    //   var date = $filter('date')($scope.startdate, 'yyyy-MM-dd')
    //   var date1 = $filter('date')($scope.enddate, 'yyyy-MM-dd')
    //   $http.post('/pos/salebybill', { startdate: date, enddate: date1 }).then(function (res) {
    //     console.log(res);
    //     // $scope.reports = res.data.result;
    //     // if (res.data.result.length >= 1) {
    //     //   console.log(res.data.result[0].length)
    //     //   $scope.grandtotal = res.data.data[0];
    //     // }
    //     // else {
    //     //   $scope.grandtotal = ''
    //     // }
    //     // $scope.showdate = false
    //   });
    // }
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
