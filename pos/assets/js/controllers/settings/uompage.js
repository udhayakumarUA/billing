angular.module('posApp')
 .controller('uomCtrl', function($scope, $mdDialog,verifyDelete,$http) {
  $scope.customFullscreen = false;
  $scope.uoms=[];
  $scope.skip=0;
  $scope.noMore = true;
  $scope.count=1;
 //get data
  $http.post('/uom/getuom').then(function (res) {
    console.log(res)
    $scope.uoms=res.data.uoms;
    $scope.uoms1=res.data.uoms1;
    $scope.count = res.data.count;
    $scope.skip = $scope.skip+=10;
    if ($scope.count <11 ){
      $scope.noMore = true;
    }
    else{$scope.noMore = false;}
  });

  //add data
   $scope.addUom = function(ev) {
    $mdDialog.show({
      controller: adduomController,
      templateUrl: 'templates/settings/dialogs/adduom.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(uom) {
      console.log(uom)
      $scope.uoms = uom;;
    });
  };
  $scope.more=function(){
    $http({
      url: '/uom/getmoreuom',
      method: "POST",
      params: {skip: $scope.skip}
    }).then(function (res) {
      $scope.count = res.data.count;
      for (var i = 0; i < res.data.uoms.length; i++) {
        $scope.uoms.push(res.data.uoms[i])
      }
      $scope.skip = $scope.skip +=10;
      if ($scope.skip >= $scope.count) {
        $scope.noMore = true;
      }
    });

  }
   function adduomController($scope, $mdDialog) {

     $scope.adduom=function () {
       $http.post('/uom/adduom',{uomname:$scope.uomname,uomcode:$scope.uomcode}).then(function (res) {
        
        $mdDialog.hide(res.data.uoms);
       })
     };
     $scope.cancel = function() {
       $mdDialog.cancel();
     };

   }


   //edit data
   $scope.editUom = function(ev,id,index) {
    $mdDialog.show({
      controller: edituomController,
      templateUrl: 'templates/settings/dialogs/edituom.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      locals:{id:id,index:index},
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(uom) {
      $scope.uoms[index].uomname=uom[0];
      $scope.uoms[index].uomcode=uom[1];
    });
  };

  function edituomController($scope, $mdDialog,id,index) {
    console.log(index)
    $http.post('/uom/getsingleuom',{id:id}).then(function (res) {
      $scope.uom=res.data.uom;
    });
    $scope.updateuom=function (id) {
      
      console.log()
      $http.post('/uom/edituom',{id:id,uomname:$scope.uom.uomname,uomcode:$scope.uom.uomcode}).then(function (res) {
        $mdDialog.hide([$scope.uom.uomname,$scope.uom.uomcode]);
      });
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  }

  //delete
    $scope.delete=function(id,index){
       verifyDelete(id).then(function() {
         $http.post('/uom/deleteuom',{id:id}).then(function (res) {
          //  $scope.uoms=res.data.uoms;
           $scope.uoms.splice(index, 1);
         })
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
