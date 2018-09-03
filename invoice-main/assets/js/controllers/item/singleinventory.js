angular.module('posApp')
  .controller('SingleinventoryCtrl', function($scope,$http,verifyDelete,$mdToast,$stateParams,$state,$rootScope) {

    //get the single inventory data from the database
    (()=>{
      
      $http.post('/inventory/getSingleBill',{id:$stateParams.id}).then(function (res) {
        console.log(res)
        $scope.inventory = res.data.result
      })

    })();

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

    $scope.delete=function(id){
      verifyDelete(id).then(function() {
        $http.post('/inventory/deleteInventory',{reason:$scope.inventory.reason,id:$scope.inventory.id,quantity:$scope.inventory.quantity,productid:$scope.inventory.item.id}).then(function (res) {
          $state.go('inventory')
          $scope.success('Deleted Successfully')
        })
      })
    };

    $scope.success = function(text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };

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
