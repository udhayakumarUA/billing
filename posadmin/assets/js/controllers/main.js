'use strict';

angular.module('posadminApp')
  .controller('MainCtrl', function ($scope, $mdToast,$http,$rootScope,$state) {
    $scope.login=function () {
      $http.post('/user/adminlogin',{username:$scope.username,password:$scope.password}).then(function (res) {
        console.log(res);
        $rootScope.me=res.data.me;
        localStorage.setItem('adminid',res.data.me.id)
        $state.go('pos.index');
        $scope.success(res.data.message);
      }).catch(function (err) {
        console.log(err);
        $scope.error(err.data.err)
      })
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

    $scope.success = function(msg) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(msg)
          .position('top right')
          .theme('success-toast')
          .hideDelay(3000)
      );
    };
    $scope.logout=function () {
      $http.post('/user/adminlogout').then(function (res) {
        $rootScope.me=null;
        $state.go('login')
      })
    }
  })
  .run(['$http','$rootScope', '$state','$location','$window' , function ($http,$rootScope, $state,$location,$window)
    {
      $rootScope.me=window.SAILS_LOCALS.me;

      console.log($rootScope.me);

      $rootScope.$on('$stateChangeError', function(event) {
        // $state.go('app.dashboard');
      });


      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {


      });

      var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState,toParams, fromState)
      {
        console.log(toState.data.authenticated);
        console.log(toState.name)

        if(toState.data.authenticated==true&&$rootScope.me==null){
          event.preventDefault();
          $state.go('login');
        }
        else if(toState.data.authenticated==false&&$rootScope.me!=null) {
          event.preventDefault();
          $state.go('pos.index');
        }

      })
    }
    ]);
