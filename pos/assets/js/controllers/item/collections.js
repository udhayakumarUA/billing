angular.module('posApp')
 .controller('collectionsCtrl', function($scope, $mdDialog,verifyDelete,$http,$mdToast) {
 	 $scope.status = '';
 	 $scope.rows=10;
   $scope.count=0;
   $scope.currentpage=1;
   $scope.collections=[];
   $scope.searchtext='';
   $scope.customFullscreen = false;

   $http.post('/collection/getcollection').then(function (res) {
     console.log(res)
     $scope.count=res.data.count;
     $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
   });

   $scope.exportAction = function (option) {
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

   //getmore
   $scope.more=function () {
     if($scope.searchtext=='') {
       $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
       $http.post('/collection/morecollection', {skip: $scope.skip, limit: $scope.rows}).then(function (res) {
         $scope.collections = res.data.collections;
       })
     }
     else {
       $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
       $http.post('/collection/searchcollections', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
         $scope.collections = res.data.collections;
       })
     }
   };

   //search
   $scope.search=function (searchtext) {
     $scope.currentpage=1;
     $scope.skip=(($scope.currentpage-1)*parseInt($scope.rows));
     $http.post('/collection/searchcollections',{searchtext:searchtext,skip:$scope.skip,limit:$scope.rows}).then(function (res) {
      $scope.count=res.data.count;
       $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
       $scope.collections=res.data.collections;
     })
   }


//limit
   $scope.changevalue=function () {
     if($scope.searchtext=='') {
       $scope.currentpage = 1;
       $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
       $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
       $http.post('/collection/morecollection', {skip: $scope.skip, limit: $scope.rows}).then(function (res) {
         $scope.collections = res.data.collections;
       });
     }
     else{
       $scope.currentpage = 1;
       $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
       $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
       $http.post('/collection/searchcollections', {searchtext:$scope.searchtext,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
         $scope.collections = res.data.collections;
       });
     }
   }
   //edit data
   $scope.editcollection = function(ev,id) {
     $mdDialog.show({
       controller: editcollectionController,
       templateUrl: 'templates/item/dialog/editcollection.html',
       parent: angular.element(document.body),
       targetEvent: ev,
       locals:{id:id},
       clickOutsideToClose:true,
       fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
     })
       .then(function(collection) {
         $scope.collections = collection;
       });

   };

   function editcollectionController($scope, $mdDialog,id) {
     $http.post('/collection/getsinglecollection',{id:id}).then(function (res) {
       $scope.collection=res.data.collection;
     });
     $scope.updatecollection=function (id) {
       $http.post('/collection/editcollection',{id:id,skip: $scope.skip, limit: $scope.rows,collectiontitle:$scope.collection.collectiontitle,collectioncode:$scope.collection.collectioncode,description:$scope.collection.description}).then(function (res) {
         $mdDialog.hide(res.data.collections);
         $scope.success('Updated Successfully')
       });
     };

     $scope.cancel = function() {
       $mdDialog.cancel();
     };
   }

   //delete
   $scope.delete=function(ev,id){
     verifyDelete(id).then(function() {
       $http.post('/collection/deletecollection',{id:id,skip: $scope.skip, limit: $scope.rows}).then(function (res) {
         $scope.collections=res.data.collections;
         $scope.count=res.data.count;
         $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
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
