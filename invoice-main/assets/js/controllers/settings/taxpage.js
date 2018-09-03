angular.module('posApp')
 .controller('taxCtrl', function($scope, $http,$mdDialog,verifyDelete) {
 	 $scope.status = '';
  $scope.customFullscreen = false;
  $scope.taxes=[];
  $scope.skip=0;
  $scope.noMore = true;
  $scope.count=1;
    $http.post('/tax/gettaxes').then(function(res){
      console.log(res)
      $scope.taxes = res.data.result
      $scope.count = res.data.count;
      $scope.skip = $scope.skip+=20;
      if ($scope.count < 21 ){
        $scope.noMore = true;
      }
      else{$scope.noMore = false;}
    })
    //  $http.post('/taxexe/gettaxexees').then(function(res){
    //   console.log(res)
    //   $scope.exemption = res.data.result
    //    $scope.count = res.data.count
    //   $scope.skip = $scope.skip+=10;
    //   if ($scope.count < 11 ){
    //     $scope.noMore = true;
    //   }
    //   else{$scope.noMore = false;}
    // })
    $scope.insertdata = ()=>{
      $http.post('/tax/generatetax').then(function(res){
        $scope.taxes = res.data.data
      })
    }
     $scope.getmore = function(){
       $http({
          url: '/taxexe/getmoretaxexe',
          method: "POST",
          params: {skip: $scope.skip}
        }).then(function (res) {
          $scope.count = res.data.count;
          for (var i = 0; i < res.data.result.length; i++) {
            $scope.exemption.push(res.data.result[i])
          }
          $scope.skip = $scope.skip += 20;
          if ($scope.skip >= $scope.count) {
            $scope.noMore = true;
          }
        });
     }
  $scope.more=function(){
      $http({
        url: '/tax/getmoretax',
        method: "POST",
        params: {skip: $scope.skip}
      }).then(function (res) {
        console.log(res)
        $scope.count = res.data.count;
        for (var i = 0; i < res.data.result.length; i++) {
          $scope.taxes.push(res.data.result[i])
        }
        $scope.skip = $scope.skip +=20;
        if ($scope.skip >= $scope.count) {
          $scope.noMore = true;
        }
      });
  
    }
   $scope.addtax = function(ev) {
    $mdDialog.show({
      controller: AddTaxController,
      templateUrl: 'templates/settings/dialogs/addtax.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.skip=0;
      $scope.noMore = true;
      $scope.taxes = answer.data;
      $scope.count = answer.count;
      $scope.skip = $scope.skip+=20;
      if ($scope.count < 21 ){
        $scope.noMore = true;
      }
      else{$scope.noMore = false;}
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };
  $scope.edittax = function(ev,id,index) {
    $mdDialog.show({
      controller: EditTaxController,
      locals:{id:id},
      templateUrl: 'templates/settings/dialogs/edittax.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.taxes[index].name = answer[0];
      $scope.taxes[index].type = answer[1];
      $scope.taxes[index].rate = answer[2];
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };

  $scope.addtaxexp = function(ev) {
    $mdDialog.show({
      controller: AddTaxExeController,
      templateUrl: 'templates/settings/dialogs/addtaxexp.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.exemption = answer
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };
  $scope.edittaxexp = function(ev,id) {
    $mdDialog.show({
      controller: EditTaxexeController,
      locals:{id:id},
      templateUrl: 'templates/settings/dialogs/edittaxexp.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
      $scope.exemption = answer
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };
  function AddTaxController($scope, $mdDialog) {
    
    $scope.addtaxdata = function() {
      // $scope.taxrates = parseFloat($scope.taxrate).toFixed(2)
      // console.log($scope.taxrates)
     $http.post('/tax/addtax',{taxname:$scope.taxname,taxtype:$scope.taxtype,taxrate:$scope.taxrate}).then(function(res){
      console.log(res.data.data)
      $scope.answer(res.data)
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
  function AddTaxExeController($scope, $mdDialog) {
    
    $scope.add = function() {
      // $scope.taxrates = parseFloat($scope.taxrate).toFixed(2)
      // console.log($scope.taxrates)reason:$scope.reason,paragraph:$scope.paragraph,type:$scope.type
     $http.post('/taxexe/addtaxexe',{reason:$scope.reason,paragraph:$scope.paragraph,type:$scope.type}).then(function(res){
      console.log(res.data.data)
      $scope.answer(res.data.data)
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
  function EditTaxController(id,$scope, $mdDialog) {
   
    $http.post('/tax/getsingletax',{id,id}).then(function(res){
      console.log(res)
      $scope.taxdata = res.data.result;
      // console.log(parseFloat(res.data.result.rate).toFixed(2))
    })
     $scope.update = function() {
      $http.post('/tax/updatetax',{id,id,taxname:$scope.taxdata.name,taxtype:$scope.taxdata.type,taxrate:$scope.taxdata.rate}).then(function(res){
      console.log(res)
      $mdDialog.hide([$scope.taxdata.name,$scope.taxdata.type,$scope.taxdata.rate]);
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
   function EditTaxexeController(id,$scope, $mdDialog) {
   
    $http.post('/taxexe/getsingletaxexe',{id,id}).then(function(res){
      console.log(res)
      $scope.exedata = res.data.result;
      // console.log(parseFloat(res.data.result.rate).toFixed(2))
    })
     $scope.updateexe = function() {
      $http.post('/taxexe/updatetaxexe',{id,id,reason:$scope.exedata.reason,paragraph:$scope.exedata.paragraph,type:$scope.exedata.type}).then(function(res){
      console.log(res)
      $mdDialog.hide(res.data.result);
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
  $scope.delete=function(id,index){
    console.log(id)
      verifyDelete(id).then(function() {
        $http.post('/tax/deletetax',{id:id}).then(function(res){
          console.log(res)
          $scope.taxes.splice(index,1)
           
        })
         console.log('deleted')
      })
    }
    $scope.delete1=function(id){
    console.log(id)
      verifyDelete(id).then(function() {
        $http.post('/taxexe/deletetaxexe',{id:id}).then(function(res){
          console.log(res)
          $scope.exemption = res.data.result
           
        })
         console.log('deleted')
      })
    }
 }).factory('verifyDelete',['$mdDialog', function($mdDialog) {
  return function(id) {
    var confirm = $mdDialog.confirm()
      .title('Are you sure!, Do you want to Delete')
      .content('')
      .ariaLabel('Delete')
      .ok('Ok')
      .cancel('Cancel');
    return $mdDialog.show(confirm);
  }
  }]);
