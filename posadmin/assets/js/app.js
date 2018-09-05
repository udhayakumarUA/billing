'use strict';


  angular.module('posadminApp', [
    'ui.router',
    'ngMaterial'
])
  .config(function ($stateProvider, $urlRouterProvider,$locationProvider) {
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('pos', {
        views:{
          'header':{
            templateUrl: 'templates/header.html'
          },
          'nav':{
            templateUrl: 'templates/navbar.html'
          },
          '':{
            template: '<div style="padding-top: 80px" ui-view></div>'
          },
          'footer':{
            templateUrl: 'templates/footer.html'
          }

        }
      })
      .state('login', {
        url:'/login',
        controller:'MainCtrl',
        data:{authenticated:false},
        templateUrl: 'templates/login.html'
      })
      .state('pos.index', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller:'dashboardCtrl',
        data:{authenticated:true}
      })
      .state('pos.newclient', {
        url: '/newclient',
        templateUrl: 'templates/newclient.html',
        data:{authenticated:true},
        controller: 'NewclientCtrl'
      })
      .state('pos.offlineusers', {
        url: '/offlineusers',
        templateUrl: 'templates/offlineusers.html',
        data:{authenticated:true},
        controller: 'OfflineusersCtrl'
      })
      .state('pos.onlineusers', {
        url:'/onlineusers',
        templateUrl: 'templates/onlineusers.html',
        data:{authenticated:true},
        controller: 'OnlineusersCtrl'
      })
      .state('pos.changepass', {
        url: '/changepassword',
        templateUrl: 'templates/changepassword.html',
        controller:'changepassword',
        data:{authenticated:true}
      })
      .state('pos.subadmin', {
        url: '/subadmin',
        templateUrl: 'templates/subadmin.html',
        controller:'subadminCtrl',
        data:{authenticated:true}
      })
      .state('pos.singleusers', {
        url:'/singleusers/:id',
        templateUrl: 'templates/singleusers.html',
        data:{authenticated:true},
        controller: 'SingleusersCtrl'
      });
  })




