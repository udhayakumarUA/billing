angular.module('posApp')
  .controller("OrganCtrl", ['$scope', '$http','$state','Upload','$mdToast', function($scope, $http,$state,Upload,$mdToast) {
    $http.post('/user/getuser',{key:localStorage.getItem('key')}).then(function (res) {
      console.log(res)
      $scope.user=res.data.user;
      $scope.user.postalcode=parseInt($scope.user.postalcode);
      $scope.user.mobileno=parseInt($scope.user.mobileno);
      $scope.user.phoneno=parseInt($scope.user.phoneno);
      $scope.user.statecode=parseInt($scope.user.statecode)
    });
   $scope.updateuser=function (files,id){
     if(files) {
       Upload.upload({
         url: '/user/updateuser',
         file: files,
         fileName: files.name,
         fileFormDataName: 'avatar',
         params: {
           company: $scope.user.company,
           fistname: $scope.user.fistname,
           lastname: $scope.user.lastname,
           email: $scope.user.email,
           phoneno: $scope.user.phoneno,
           mobileno: $scope.user.mobileno,
           address: $scope.user.address,
           city: $scope.user.city,
           country: $scope.user.country,
           postalcode: $scope.user.postalcode,
           bussinessloc: $scope.user.bussinessloc,
           address1: $scope.user.address1,
           statecode: $scope.user.statecode,
           website: $scope.user.website,
           fax: $scope.user.fax,
           gstin: $scope.user.gstin,
           id: id
         }
       }).progress(function (evt) {
         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
         console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
       }).then(function (data, status, headers, config, res) {
         console.log(data);
         $scope.success();
         $scope.disabled = false;
       }).catch(function (err) {
         console.log(err);
         $scope.disabled = false;
         console.log(err);
         $scope.error(err.data.err)
       })
     }
     else{
       $http.post('/user/updateuser1',{
         company: $scope.user.company,
         fistname: $scope.user.fistname,
         lastname: $scope.user.lastname,
         email: $scope.user.email,
         phoneno: $scope.user.phoneno,
         mobileno: $scope.user.mobileno,
         address: $scope.user.address,
         city: $scope.user.city,
         country: $scope.user.country,
         postalcode: $scope.user.postalcode,
         bussinessloc: $scope.user.bussinessloc,
         address1: $scope.user.address1,
         statecode: $scope.user.statecode,
         website: $scope.user.website,
         fax: $scope.user.fax,
         gstin: $scope.user.gstin,
         id: id}).then(function (res) {
         $scope.success();
       }).catch(function (err) {
         $scope.error(err.data.err)
       })
     }
   };
$scope.error = function(err) {
  $mdToast.show(
    $mdToast.simple()
      .textContent(err)
      .position('top=30px, right')
      .theme('error-toast')
      .hideDelay(3000)
  );
};
    $scope.success = function() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Profile Updated')
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
  }]);
