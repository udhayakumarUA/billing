angular.module('posApp')
  .controller("bankdetailsCtrl", ['$scope', '$http','$state','Upload','verifyDelete','$mdToast', function($scope, $http,$state,Upload,verifyDelete,$mdToast) {
    $scope.savebtn=true;
    $scope.updatebtn=false;
    $scope.resetbtn=false;
    $scope.getdetails = ()=>{
    $http.post('/bank/getdetails').then(function (res) {
      console.log(res)
      $scope.banks=res.data.bank;
      res.data.bank.some(val=>{if(val.default) return true})?'':$scope.setdefault(res.data.bank[0].id)
    });
  }
  $scope.getdetails();
    $scope.updatebank=function (){
      console.log('asdfas')
      $http.post('/bank/updatebank',{
        bankname: $scope.bankname,
        branchname: $scope.branchname,
        accountno: $scope.accountno,
        accountname: $scope.accountname,
        ifsccode: $scope.ifsccode,
        id:$scope.id
      }).then(function (res) {
          $scope.success(res.data.msg);
          $scope.reset();
          $scope.getdetails()
        }).catch(function (err) {
          $scope.error(err.data.err)
        })
    };

    // $scope.addbank=function (){
    //   $http.post('/bank/updatebank',{
    //     bankname: $scope.bankname,
    //     branchname: $scope.branchname,
    //     accountno: $scope.accountno,
    //     accountname: $scope.accountname,
    //     ifsccode: $scope.ifsccode}).then(function (res) {
    //       $scope.success('Bank Details Added Successfully');
    //       $scope.reset();
    //       $scope.getdetails()
    //     }).catch(function (err) {
    //       $scope.error(err.data.err)
    //     })
    // };

    $scope.editbank=(id)=>{
      $scope.bank = ($scope.banks.filter(bankid=>bankid.id==id))[0]
      $scope.bankname= $scope.bank.bankname
      $scope.branchname= $scope.bank.branchname      
      $scope.accountno= $scope.bank.accountno
      $scope.accountname= $scope.bank.accountname
      $scope.ifsccode = $scope.bank.ifsccode
      $scope.id = $scope.bank.id
      $scope.savebtn=false;
      $scope.updatebtn=true;
      $scope.resetbtn=true;
      console.log($scope.bank)
      console.log($scope.banks)
    }
    $scope.reset=()=>{
        $scope.bankname= ''
        $scope.branchname= ''    
        $scope.accountno= ''
        $scope.accountname= ''
        $scope.ifsccode = ''
        $scope.id=false
        $scope.bankform.$setPristine();
        $scope.bankform.$setValidity();
        $scope.bankform.$setUntouched();
      $scope.savebtn=true;
      $scope.updatebtn=false;
      $scope.resetbtn=true;
    }
    $scope.delete = (id)=>{
      verifyDelete(id).then(function () {
      $http.post('/bank/deletebank',{id:id}).then((res)=>{
        $scope.getdetails();
      })
    })
    }
    $scope.setdefault = (id)=>{
      console.log(id)
      $http.post('/bank/setdefault',{id:id}).then((res)=>{
        console.log(res)
        $scope.getdetails();
      })
    }

    $scope.error = function(err) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(err)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
    $scope.success = function(txt) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(txt)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
  }]).factory('verifyDelete', ['$mdDialog', function ($mdDialog) {
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
