angular.module('posApp')
    .controller('EditexpenseCtrl', function ($scope, $http,$filter,$state,$location, $stateParams,verifyDelete, $mdToast) {
        console.log('editexpense')
        $http.post('/expense/findexpense').then(function (res) {
            $scope.expensetype = res.data.data
          })  
          
        $http.post('/expense/singleexpense',{expid:$stateParams.expid}).then(function (res) {
            console.log(res);
            $scope.exp = res.data.expense;
            $scope.expcgst = parseFloat((res.data.expense.amount*res.data.expense.cgst)/100)
            $scope.expsgst = parseFloat((res.data.expense.amount*res.data.expense.sgst)/100)
            $scope.expigst = parseFloat((res.data.expense.amount*res.data.expense.igst)/100)
            $scope.expcess = parseFloat((res.data.expense.amount*res.data.expense.cess)/100)
            $scope.amount = res.data.expense.amount
            $scope.tax = res.data.expense.tax
            $scope.cgst= res.data.expense.cgst?res.data.expense.cgst:0
            $scope.sgst= res.data.expense.sgst?res.data.expense.sgst:0
            $scope.igst= res.data.expense.igst?res.data.expense.igst:0
            $scope.cess= res.data.expense.cess?res.data.expense.cess:0
            $scope.selectedcustomer=res.data.expense.name
            $scope.calculate();
            // $scope.count = res.data.count;
            // $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
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
            $scope.taxc =($scope.amount+(parseFloat($scope.amount*$scope.totaltax)/100)).toFixed(2)
            $scope.tax =($scope.amount+(parseFloat($scope.amount*$scope.totaltax)/100))

        }
        $scope.updateexpense = function () {
            if ($scope.selectedcustomer) {
                var id = $scope.selectedcustomer.id
                console.log(id)
            }
            else{
                var id = ''
                console.log(id)
            }
                var startdate = $filter('date')($scope.exp.date, 'yyyy-MM-dd')
                $http.post('/expense/updateexpenses', {
                    expensetype: $scope.exp.expensetype,
                    amount: $scope.amount,
                    cgst:$scope.cgst,
                    sgst:$scope.sgst,
                    igst:$scope.igst,
                    cess:$scope.cess,
                    tax: $scope.tax,
                    date: startdate,
                    paymentmode: $scope.exp.paymentmode, 
                    name: id, 
                    expensesid: $stateParams.expid
                })
                    .then(function (res) {
                        $scope.success('Updated Successfully')
                        console.log(res)
                        $location.path('/singleexpenses/'+$stateParams.expid);
                    })
        }
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
        $scope.success = function (text) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position('top=30px, right')
                    .theme('error-toast')
                    .hideDelay(3000)
            );
        };
        
    //Delete Single Expense
    $scope.delete = function (id,type) {
        console.log(type)
        verifyDelete(id).then(function () {
          $http.post('/expense/deleteexpense', { id: id,type:type }).then(function (res) {
            console.log(res)
            $scope.expenses = res.data.result
            $state.go('expensebill')
          })
          console.log('deleted')
        })
  
      }
    })
    
