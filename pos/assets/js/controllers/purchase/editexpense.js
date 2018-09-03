angular.module('posApp')
    .controller('EditexpenseCtrl', function ($scope, $http,$filter,$state,$location, $stateParams,verifyDelete, $mdToast) {
        console.log('editexpense')

        $http.post('/expense/findexpense').then(function (res) {
            $scope.expensetype = res.data.data
          })  
          
        $http.post('/expense/singleexpense',{expid:$stateParams.expid}).then(function (res) {
            console.log(res);
            $scope.exp = res.data.expense;
            $scope.selectedcustomer=res.data.expense.name
            // $scope.count = res.data.count;
            // $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        });
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
                    expensetype: $scope.exp.expensetype, amount: $scope.exp.amount, tax: $scope.exp.tax, date: startdate,
                    paymentmode: $scope.exp.paymentmode, name: id, expensesid: $stateParams.expid
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
    $scope.delete = function (id) {
        console.log(id)
        verifyDelete(id).then(function () {
          $http.post('/expense/deleteexpense', { id: id }).then(function (res) {
            console.log(res)
            $scope.expenses = res.data.result
            $state.go('expensebill')
          })
          console.log('deleted')
        })
  
      }
    })
    
