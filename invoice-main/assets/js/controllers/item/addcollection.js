angular.module('posApp')
  .controller('AddcollectionCtrl', function($scope, $mdToast,$state,$http) {
    $scope.addcollection = function () {
      $scope.data ='';
      $http.post('/collection/addcollection', {collectiontitle: $scope.collectiontitle, collectioncode: $scope.collectioncode,description:$scope.description}).then(function (res) {
        $state.go('collections');
        $scope.success();
      }).catch(function (err) {
        console.log(err);
        $scope.data ="ss"
      })
    };
    $scope.success = function() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Collection Added')
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
  })
