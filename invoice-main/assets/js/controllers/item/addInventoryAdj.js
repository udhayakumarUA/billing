angular.module('posApp')
  //THIS CONTROLLER  CONTAINS THE FUNCTIONS FOR ADD, EDIT AND SINGLE INVENTORY PAGES
  .controller('AddInventoryadjustmentCtrl', function ($scope, $filter, $stateParams, $mdDialog, verifyDelete, $http, $mdToast, $state, $rootScope, ) {
    //DECLERATION OF THE SCOPE VALUE USED IN THIS CONTROLLER
    $scope.edit=false;
    //THIS IS THE SELF INVOKING FUNCTION THAT AUTOMATICALLY CALL THE FUNCTIONS
    (() => {

      //The function is to check whether the request from add page or edit page
      if ($stateParams.id) {
        //TIS IS TO SCOPE VALUE THE DESIDED TO ADD A NEW INVENTORY OR UPDATE THE INVENTORY
        $scope.edit=true
        //IF THE REQUEST IS FROM THE EDIT PAGE ASSIGN THE DATA TO THEIR REQUIRED FIELDS
        $http.post('/inventory/getSingleBill', { id: $stateParams.id }).then(function (res) {
          console.log(res)
          $scope.inventory = res.data.result
          $scope.inventoryId = res.data.result.id
          $scope.referenceno = res.data.result.refid
          $scope.oldnumber = res.data.result.refid
          $scope.quantity = res.data.result.quantity
          $scope.oldstock = res.data.result.quantity
          $scope.product.selectedItem = res.data.result.item
          $scope.date = res.data.result.date
          $scope.reason = res.data.result.reason
          $scope.description = res.data.result.description
        })
      }
      else{
        //TO GET THE REFERENCE ID FROM THE DATABASE 
      $http.post('/inventory/getid').then(function (res) {
       
        $scope.referenceno = res.data.id
      })
      }
      console.log($rootScope.clientid)
      //GETTING THE USE WHO ADDING THE INVENTORY DETAILS 
      $http.post('/user/getSingleUser', { id: $rootScope.clientid }).then((res) => {
        console.log(res)
        $scope.user = res.data.result;
      })
      //TO GET THE ADDITIONAL REASONS ADDED BY THE ADMIN IN THE DATABASE
      $http.post('/inventory/findreason').then(function (res) {
        $scope.reasons = res.data.data
      })
    })();

    //Check wether the Inventory ID Already exist
    $scope.checkid = (id) => {
      console.log(id)
      if (id == undefined) {
        console.log('it field should not be empty')
        return
      } 
      else if(id!=$scope.oldnumber)
       {

        return $http.post('/inventory/checkid', { id: id }).then(function (res) {
          console.log(res)

        }).catch((err) => {
          console.log(err)
          $scope.err = err.data.err
          return
        })
      }
    }
    //Save the inventory adjustment to the database\
    //THIS FUNCTION IS FOR BOTH THE ADD AND EDIT INVENTORY, BASED ON THE EDIT VARIABLE VALUE
    $scope.saveInventory = () => {
      console.log($scope.referenceno)
      var date = $filter('date')($scope.date, 'yyyy-MM-dd')
      $http.post('/inventory/addInventory', {
        refid: $scope.referenceno,
        quantity: $scope.quantity,
        item: $scope.product.selectedItem.id,
        itemname: $scope.product.selectedItem.productname,
        date: date,
        reason: $scope.reason,
        description: $scope.description,
        user: $scope.user.id,
        username: $scope.user.username,
        //if the edit value is true it will update the values in the database else add as new data
        edit:$scope.edit,
        //It is the id to update, if the request is from the edit page
        inventoryId:$scope.inventoryId,
        oldstock:$scope.oldstock
      }).then(function (res) {
        console.log(res)
        $scope.success('Added Successfully')
        $state.go('inventory')

      }).catch((err) => {
        //show the error if the inventory number already exist
        console.log(err)
        $scope.error(err.data.err)
      })
    }

    //add new reason to the existing reasons
    $scope.add = function (ev) {
      console.log('test')
      $mdDialog.show({
        controller: newInventoryReason,
        templateUrl: 'templates/item/dialog/addnewreason.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function (answer) {
          console.log(answer)
          $scope.reasons = answer;
        }, function () {
          $scope.status = 'You cancelled the dialog.';
        });
    };
    //Adding new reason popup controller
    function newInventoryReason($scope, $mdDialog) {
      //Bellow function for adding the user's new reason to the database
      $scope.addnew = function () {
        $http.post('/inventory/addnewreason', { reason: $scope.reason }).then(function (res) {
          console.log(res.data.data)
          $scope.answer(res.data.data)
        }).catch(function (err) {
          console.log(err);
          $scope.data = "ss"
        })
      };
      //returning the data to the parent controller
      $scope.hide = function () {
        $mdDialog.hide();
      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };

      $scope.answer = function (answer) {
        $mdDialog.hide(answer);
      };
    }
    //Searching the inventory selected item in the database
    $scope.searchproducts = function (searchtext) {
      return $http
        //Here using the single request for accessing the inventory checked item 
        .post('/inventory/searchInventoryProducts', { searchtext: searchtext })
        .then(function (res) {
          console.log(res);
          return res.data.products;
        }).catch(function (err) {
          return [];
        })
    };
    //delete the reason add by the user
    $scope.cancel = function () {
      $mdDialog.cancel();
    };
    $scope.deletereason = (id)=>{
      console.log(id)
      verifyDelete(id).then(function () {
        $http.post('/inventory/deleteaddedreason', { id: id }).then(function (res) {
        $scope.reasons = res.data.data;
        })
        console.log('deleted')
      })

    }
 

    //---------------------------------Edit Page Functions and Controles---------------------------------------------//
    $scope.update = ()=>{
      
    }
    //----------------------------------------------------------------------------------------------  
    
    //Toast for the error message 
    $scope.error = function (err) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(err)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
    //Toast for the success message
    $scope.success = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
  });
