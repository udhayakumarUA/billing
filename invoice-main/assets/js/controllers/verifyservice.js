angular.module('posApp')
  .service('verifyservice', function($http,$rootScope) {
    this.checkuser=function () {
     console.log(localStorage.getItem('role'));
     
      return $http.post('/user/checkuser').then(function (res) {
        console.log(res)
        return res.data;
      })
    }
  });
