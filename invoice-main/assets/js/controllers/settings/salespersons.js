angular.module('posApp')
.controller('SalespersonCtrl', function ($scope, $mdDialog, verifyDelete, $http, $mdToast,Upload) {
    $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.collections=[];
    $scope.searchtext='';
    $scope.customFullscreen = false;
    $scope.getalldata = ()=>{
        $http.post('/salesperson/getAllSalesPerson',{limit:$scope.rows}).then(function (res) {
            console.log(res)
            $scope.salespersons = res.data.result; 
            $scope.count = res.data.count
            $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        })
    }
    $scope.getalldata()
    
    $scope.more = function () {
        if ($scope.searchtext == '') {
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post('/salesperson/getAllSalesPerson', { skip: $scope.skip, limit: $scope.rows}).then(function (res) {
            console.log(res)
            $scope.salespersons = res.data.result;
          })
        }
        else {
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post('/salesperson/searchSalesperson', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows}).then(function (res) {
            $scope.salespersons = res.data.result;
          })
        }
      };
  
       //search
       $scope.search = function (searchtext) {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/salesperson/searchSalesperson', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows,}).then(function (res) {
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
          $scope.salespersons = res.data.result;
        })
      };
  
        //limit
        $scope.changevalue = function () {
          if ($scope.searchtext == '') {
            $scope.currentpage = 1;
            $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
            $http.post('/salesperson/getAllSalesPerson', { skip: $scope.skip, limit: $scope.rows}).then(function (res) {
              $scope.salespersons = res.data.result;
              $scope.count = res.data.count;
              $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
            });
          }
          else {
            $scope.currentpage = 1;
            $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
            $http.post('/salesperson/searchSalesperson', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows}).then(function (res) {
              $scope.salespersons = res.data.result;
              $scope.count = res.data.count;
              $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
            });
          }
        }



    $scope.addSalesperson = function (ev) {
        $mdDialog.show({
            controller: AddSalesPersonController,
            templateUrl: 'templates/settings/dialogs/addsalesperson.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function (users) {
                $scope.getalldata()
            });
    };

    $scope.delete = function (id) {
        verifyDelete(id).then(function () {
            console.log('deleted')
            $http.post('/salesperson/deleteSalesPerson', { id: id }).then(function (res) {
                $scope.salespersons = res.data.result;
                $scope.success()
            })
        })
    }
    $scope.success = function (msg) {
        $mdToast.show(
            $mdToast.simple()
                .textContent('Deleted Successfully')
                .position('top right')
                .theme('success-toast')
                .hideDelay(1000)
        );
    };

    $scope.error = function (err) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(err)
                .position('top=30px, right')
                .theme('error-toast')
                .hideDelay(3000)
        );
    };

    function AddSalesPersonController($scope, $mdDialog, $mdToast) {

        $scope.addsalesperson = function () {
            $http.post('/salesperson/addsalesperson', { name: $scope.name, email: $scope.email, phonenumber: $scope.phonenumber }).then(function (res) {
                $scope.success()
                $mdDialog.hide(res.data.result);
            }).catch(function (err) {
                $scope.error(err.data.err)
            })
        }
        $scope.success = function () {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Added Successfully')
                    .position('top right')
                    .theme('success-toast')
                    .hideDelay(1000)
            );
        };
        $scope.error = function (err) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(err)
                    .position('top=30px, right')
                    .theme('error-toast')
                    .hideDelay(3000)
            );
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    }

    $scope.editsalesperson = function (ev, id) {
        $mdDialog.show({
            controller: EditController,
            templateUrl: 'templates/settings/dialogs/editsalesperson.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            locals: { id: id },
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function (user) {
                $scope.getalldata()
            });
    };
    function EditController($scope, $mdDialog, id, $mdToast) {
        $http.post('/salesperson/getSingleSalesPerson', { id: id}).then(function (res) {
            $scope.name = res.data.result.name;
            $scope.email  = res.data.result.email;
            $scope.phonenumber = res.data.result.phonenumber
        })
        $scope.update = function () {
            $http.post('/salesperson/updateSalesPerson', { id: id,name: $scope.name, email: $scope.email, phonenumber: $scope.phonenumber }).then(function (res) {
                $scope.success()
                $mdDialog.hide(res.data.result)
            })
            
        }
        $scope.success = function (msg) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Updated Successfully')
                    .position('top right')
                    .theme('success-toast')
                    .hideDelay(1000)
            );
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };

    }

    $scope.exportAction = function (option) {
        console.log('ok')
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
