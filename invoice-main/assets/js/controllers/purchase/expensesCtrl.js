angular.module('posApp')
  .controller('expensesCtrl', function ($scope, $http,$filter, $state, $mdDialog, verifyDelete) {
    console.log('expenses')
    //Declaration
    $scope.status = '';
    $scope.gsttype = '';
    $scope.rows = 20;
    $scope.count = 0;
    $scope.currentpage = 1;
    $scope.contact = [];
    $scope.searchtext = '';
    $scope.date = new Date();
    $scope.showdates = true;
    console.log(localStorage.getItem('clientid'))
    //taxes from the database
    $http.post('/return/tax').then(function (res) {
      console.log(res)
      $scope.cesss=res.data.cesss;
      $scope.igsts=res.data.igsts;
      $scope.cgsts=res.data.cgsts;
      $scope.sgsts=res.data.sgsts;
    });
    $scope.calculate = ()=>{
      $scope.totaltax = parseFloat($scope.cgst)+parseFloat($scope.sgst)+parseFloat($scope.igst)+parseFloat($scope.cess)
      $scope.tax = $scope.amount+(parseFloat($scope.amount*parseFloat($scope.totaltax))/100)

    }
    //Getting Expense Data & ID
    $scope.getexpensetype = ()=>{
    $http.post('/expense/findexpense').then(function (res) {
      $scope.expensetype = res.data.data
    })
  }      
  $scope.getexpensetype();
    $http.post('/expense/getexpenseid').then(function (res) {
      console.log(res)
      $scope.expenses = res.data.result
      console.log($scope.expenses.name)
      $scope.count = res.data.result.length
      var value = res.data.id.toString()
      $scope.expensesid = 'EXP-' + value.padStart(7, 0);
      $scope.expid = res.data.id
      $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
    })

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.add = function(ev) {
      console.log('test')
      $mdDialog.show({
        controller:addnewexpense,
        templateUrl: 'templates/purchase/dialogs/addtype.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function(answer) {
          $scope.expensetype = answer;
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };
    function addnewexpense($scope, $mdDialog) {
      
      $scope.addnew = function() {
       $http.post('/expense/addnewexpense',{type:$scope.type}).then(function(res){
        console.log(res.data.data)
        $scope.answer(res.data.data)
       }).catch(function (err) {
        console.log(err);
        $scope.data ="ss"
      })
      };
      $scope.hide = function() {
        $mdDialog.hide();
      };
  
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

    $scope.deleteexpence = (id)=>{
      verifyDelete(id).then(function () {
        $http.post('/expense/deleteaddedexpense', { id: id }).then(function (res) {
          console.log(res)
          $scope.getexpensetype();
        })
        console.log('deleted')
      })

    }

    //Contact Search
    $scope.search = function (searchtext) {
      return $http
        .post(' /contact/searchcontact', { searchtext: searchtext })
        .then(function (res) {
          console.log(res)
          return res.data.result;
        }).catch(function (err) {
          return [];
        })
    }
    $scope.check = function () {
      console.log($scope.paymentmode)
    }

    //Add New Expense
    $scope.addexpense = function () {

      if ($scope.selectedcustomer) {
        var startdate=$filter('date')($scope.date, 'yyyy-MM-dd')
        $http.post('/expense/addexpenses', {
            expensetype: $scope.expensetype,
            amount: $scope.amount,
            cgst:$scope.cgst,
            sgst:$scope.sgst,
            igst:$scope.igst,
            cess:$scope.cess,
            tax: $scope.tax,
            date: startdate,
            paymentmode: $scope.paymentmode,
            name: $scope.selectedcustomer.id, 
            expensesid: $scope.expensesid, 
            expid: $scope.expid,
            clientid:localStorage.getItem('clientid')
        })
          .then(function (res) {
            console.log(res)
            $state.go('expensebill');
          })
      }
      else {
        var startdate=$filter('date')($scope.date, 'yyyy-MM-dd')
        $http.post('/expense/addexpenses', {
            expensetype: $scope.expensetype,
            amount: $scope.amount,
            cgst:$scope.cgst,
            sgst:$scope.sgst,
            igst:$scope.igst,
            cess:$scope.cess,
            tax: $scope.tax,
            date: startdate,
            paymentmode: $scope.paymentmode,
            expensesid: $scope.expensesid,
            expid: $scope.expid,
            clientid:localStorage.getItem('clientid')
        })
          .then(function (res) {
            console.log(res)
            $state.go('expensebill');
          })
      }
    }

    //Delete Single Expense
    $scope.delete = function (id) {
      verifyDelete(id).then(function () {
        $http.post('/expense/deleteexpense', { id: id}).then(function (res) {
          console.log(res)
          $scope.expenses = res.data.result

        })
        console.log('deleted')
      })

    }
    //getmore
    $scope.more = function () {
      if ($scope.searchtext == '') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/expense/getmoreexpenses', { skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.expenses = res.data.result;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/expense/searchgetmore', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.expenses = res.data.result;
        })
      }
    };

    //search
    $scope.searchs = function (searchtext) {
      $scope.currentpage = 1;
      $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
      $http.post('/expense/searchexpenses', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows }).then(function (res) {
        $scope.count = res.data.count;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.expenses = res.data.result;
      })
    }


    //limit
    $scope.changevalue = function () {
      console.log('data')
      if ($scope.searchtext == '') {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/expense/getmoreexpenses', { skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.expenses = res.data.result;
        });
      }
      else {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/expense/searchgetmore', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.expenses = res.data.result;
          console.log(res)
        });
      }
    }


  });
