angular.module('posApp')
  .controller('SinglecontactCtrl', function ($scope, $stateParams, $location, $http, $mdDialog, verifyDelete,$filter ) {
    $scope.singleAddress = false;
    $scope.address = {address1:''};
    $scope.shippingAddress = {};
    (()=>{
      $http.get('countries.json',{id:101}).then(function(res){
        $scope.country = res.data.countries
        console.log(res);
      })
    })();
    $scope.delete = function (id) {
      verifyDelete(id).then(function () {
        $http.post('/contact/deletecontact', { id: id }).then(function (res) {
          console.log(res);
          $location.path('/contactpage');
        })
        console.log('deleted')
      })
    }
    $scope.copyAddress=()=>{
      $scope.shippingAddress = angular.copy($scope.address)
      console.log($scope.shippingAddress)
    }
    $scope.disable = false;
    $http.post('/contact/getsinglecontact', { id: $stateParams.id }).then(function (res) {
      console.log(res);

      $scope.contact = res.data.result
      $scope.contact.phonenumber = parseInt(res.data.result.phonenumber)
      $scope.contact.mobilenumber =$scope.contact.mobilenumber?parseInt(res.data.result.mobilenumber):'';
      $scope.contact.statecode = $scope.contact.statecode?parseInt(res.data.result.statecode):''
      $scope.enomore = res.data.result.estimate.length <= 3 ? $scope.enomore = true : $scope.enomore = false;
      $scope.somore = res.data.result.salesorder.length <= 3 ? $scope.somore = true : $scope.somore = false;
      $scope.pnomore = res.data.result.pos.length <= 3 ? $scope.pnomore = true : $scope.pnomore = false
      $scope.paynomore = res.data.result.paymentreceived.length <= 3 ? $scope.paynomore = true : $scope.paynomore = false;
      $scope.purnomore = res.data.result.purchase.length <= 3 ? $scope.purnomore = true : $scope.purnomore = false;
      $scope.purpaynomore = res.data.result.paymentmade.length <= 3 ? $scope.purpaynomore = true : $scope.purpaynomore = false;
      $scope.address = res.data.result.address
      $scope.shippingAddress = res.data.result.shippingAddress
      $scope.shipping = !angular.equals($scope.shippingAddress, {})
      if(typeof $scope.address =='string'){
          $scope.address={"address1": res.data.result.address};
          console.log($scope.address.address1 )
      }
      else
          $scope.singleAddress = false;
      // $scope.enomore =res.data.result.estimate.length >=3 ?$scope.enomore=true:$scope.enomore=false;
    })
    $http.post('/contact/getcustomeramount', { id: $stateParams.id }).then(function (res) {
      console.log(res);
      $scope.bill = res.data.billed[0]
      $scope.purchase = res.data.buy[0]
      console.log(res.data.buy.length)
      if (res.data.billed.length == 0 && res.data.buy.length == 0) {
        $scope.disable = false;
      }
      else {
        $scope.disable = true;
      }
      console.log($scope.purchase.maintotal);

      // $scope.totalbilled =res.data.billed[0].maintotal;
      // $scope.balancebill = res.data.billed[0].balance;
      // $scope.paidbill =$scope.totalbilled - $scope.balancebill;
      // $scope.totalpurchase = res.data.billed[0].maintotal;
      // console.log($scope.totalpurchase)
      // $scope.balancepurchase = res.data.buy[0].balance;
      // $scope.totalpaid = $scope.totalpurchase - $scope.balancepurchase;

    })
    $scope.calculate = function (total, bal) {
      $scope.due = total - bal
      console.log('due' + total)
    }
    //estimate lodemore
    $scope.elimit = 3;
    $scope.eloadMore = function () {
      eincreamented = $scope.elimit + 3;
      $scope.elimit = eincreamented >= $scope.contact.estimate.length ? $scope.enomore = true : eincreamented;
    };

    //Salesorder lodemore
    $scope.sales = 3;
    $scope.salesMore = function () {
      salescreamented = $scope.sales + 3;
      $scope.sales = salescreamented >= $scope.contact.salesorder.length ? $scope.somore = true : salescreamented;
    };

    //pos lodemore
    $scope.plimit = 3;
    $scope.ploadMore = function () {
      pincreamented = $scope.plimit + 3;
      $scope.plimit = pincreamented >= $scope.contact.pos.length ? $scope.pnomore = true : pincreamented;
    };
    //paymentReceived lodemore
    $scope.paylimit = 3;
    $scope.payloadMore = function () {
      payincreamented = $scope.paylimit + 3;
      $scope.paylimit = payincreamented >= $scope.contact.paymentreceived.length ? $scope.paynomore = true : payincreamented;
    };
    //purchase lodemore
    $scope.purlimit = 3;
    $scope.purloadMore = function () {
      purincreamented = $scope.purlimit + 3;
      $scope.purlimit = purincreamented >= $scope.contact.purchase.length ? $scope.purnomore = true : purincreamented;
    };
    //paymentmade loadmore
    $scope.purpaylimit = 3;
    $scope.purpayloadMore = function () {
      purpayincreamented = $scope.purpaylimit + 3;
      $scope.purpaylimit = purpayincreamented >= $scope.contact.paymentmade.length ? $scope.purpaynomore = true : purpayincreamented;
    };


    $scope.updatecontact = function (id) {
      $http.post('/contact/updatecontact', {
        id: id,
       type: $scope.contact.type,
       taxtype:$scope.contact.taxtype,
       pannumber:$scope.contact.pannumber,
       salutation: $scope.contact.salutation,
       firstname: $scope.contact.firstname,
       lastname: $scope.contact.lastname,
       company: $scope.contact.company,
        email: $scope.contact.email,
       phonenumber: $scope.contact.phonenumber,
       mobilenumber: $scope.contact.mobilenumber,
       address: $scope.address,
       shippingAddress: $scope.shippingAddress,
       gsttype: $scope.contact.gsttype,
       gstin: $scope.contact.gstin,
       pos: $scope.contact.plos,
       sos: $scope.contact.sos,
       statecode: $scope.contact.statecode
      })
        .then(function (res) {
          console.log(res)
          $location.path('/singlecontact/' + id);
        })
    }

    $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
      $scope.company = res.data.user.company
    })

    //sale report customer
    $scope.getreportc = function (startdate,enddate) {
      console.log(startdate);
      console.log(enddate);
      var date = $filter('date')(startdate, 'yyyy-MM-dd');
      var date1 = $filter('date')(enddate, 'yyyy-MM-dd');
      var id = $scope.contact.id;
      $http.post('/pos/getreportc', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.customerreport = res.data.result;
      });
    }

    //sale Balance report customer
    $scope.getreportcbalance = function (startdate,enddate) {
      console.log(startdate);
      console.log(enddate);
      var date = $filter('date')(startdate, 'yyyy-MM-dd');
      var date1 = $filter('date')(enddate, 'yyyy-MM-dd');
      var id = $scope.contact.id;
      $http.post('/pos/getreportcbalance', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount = res.data.amount[0];
        $scope.customerreport = res.data.result;
      });
    }

    $scope.clearedata=()=>{
      console.log('ok')
      $scope.amount = '';
      $scope.customerreport = '';
      $scope.amount2 = '';
        $scope.vendorreport = '';
    }

    $scope.getpaymentreportc = function () {
      var date = $filter('date')($scope.startdate1, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate1, 'yyyy-MM-dd')
      var id = $scope.contact.id;
      $http.post('/pos/getpaymentreportc', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount1 = res.data.amount[0];
        $scope.payments = res.data.result;
      });
    }

    $scope.getreportvendor = function (startdate,enddate) {
      var date = $filter('date')(startdate, 'yyyy-MM-dd');
      var date1 = $filter('date')(enddate, 'yyyy-MM-dd');
      var id = $scope.contact.id;
      $http.post('/pos/getreportvendor', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount2 = res.data.amount[0];
        $scope.vendorreport = res.data.result;
      });
    },

      $scope.getreportvendorbalance = function (startdate,enddate) {
        var date = $filter('date')(startdate, 'yyyy-MM-dd');
        var date1 = $filter('date')(enddate, 'yyyy-MM-dd');
        var id = $scope.contact.id;
        $http.post('/pos/getreportvendorbalance', { startdate: date, enddate: date1,id:id }).then(function (res) {
          console.log(res);
          $scope.amount2 = res.data.amount[0];
          $scope.vendorreport = res.data.result;
        });
      },

    $scope.getpaymentmadereportc = function () {
      var date = $filter('date')($scope.startdate3, 'yyyy-MM-dd')
      var date1 = $filter('date')($scope.enddate3, 'yyyy-MM-dd')
      var id = $scope.contact.id;
      $http.post('/pos/getpaymentmadereportc', { startdate: date, enddate: date1,id:id }).then(function (res) {
        console.log(res);
        $scope.amount3 = res.data.amount[0];
        $scope.paymentmade = res.data.result;
      });
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

    $scope.PrintDivpayment = function () {
      var contents = document.getElementById("dvContentsPayment").innerHTML;
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

    $scope.PrintDiv3 = function () {
      var contents = document.getElementById("dvContents3").innerHTML;
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
