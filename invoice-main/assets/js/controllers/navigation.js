'use strict';

angular.module('posApp')
  .controller('NavigationCtrl', ["$http","$scope", "$timeout", "$mdSidenav", "$mdUtil", "$log", "$location","$mdMedia","config","$state","$interval",
    function ($http,$scope, $timeout, $mdSidenav, $mdUtil, $log, $location, $mdMedia, config,$state,$interval) {
      $scope.logout=function () {
        console.log('c')
        localStorage.removeItem('key')
        localStorage.removeItem('role')
        localStorage.removeItem('clientid')
        $state.go('signin');
      }

      $http.post('/user/getuser', { key: localStorage.getItem('key') }).then(function (res) {
        console.log(res)
        $scope.user = res.data.user;
      })
      $scope.toggleLeft = buildToggler('left');

      this.sidebar_opened = $mdMedia('gt-sm') && config.sidebar_default_open;

      this.checkIfOwnPage = function () {

        return _.contains(["/login","/signup","/verifykey","/expire","/estimatestandard","/posstandard/","/pos3inch/","/posa4"], $location.path());

      };

      $scope.date = new Date();
      var tick = function() {
        $scope.clock = Date.now();
      }
      tick();
      $interval(tick, 1000);
      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildToggler(navID) {
        var debounceFn =  $mdUtil.debounce(function(){
          $(".view-container").toggleClass("slided-right");
          $(".header__menu-button").toggleClass("toggled");
          $mdSidenav(navID)
            .toggle()
            .then(function () {

            });
        },200);
        return debounceFn;
      }

    }
  ]).controller("MenuCtrl",['$location',
  function($location){

    this.goToUrl = function(url) {
      $location.path(url);
    };

    this.menu_sections = [
      {
        name: 'Dashboard',
        is_toggle:true,
        toggled: false,
        url:'/',
        icon: '/img/icons/ic_apps_24px.svg',

      },
      {
        name: 'Contacts',
        is_toggle:true,
        toggled: false,
        url:'contactpage',
        icon: '/img/icons/ic_group_24px.svg'
       },
      {
        name: 'Items',
        is_toggle:true,
        icon: '/img/icons/ic_shopping_basket_24px.svg',
        menu_items: [
           {
            name: 'Category',
            url: 'collections'
          },
          {
            name: 'Items',
            url: 'itempage'
          },
          {
            name: 'Inventory Adjustment',
            url: 'inventory'
          },
          {
            name: 'Barcode Print',
            url: 'barcodeprint'
          }
        ]
      },
      {
        name: 'Sales',
        is_toggle:true,
        toggled: false,
        icon: '/img/icons/ic_shopping_cart_24px.svg',
        menu_items: [
          {
            name: 'Estimation',
            url: 'estimatepage'
          },
          {
            name: 'Sales Order',
            url: 'salesorder'
          },
          {
            name: 'Sales Bill',
            url: 'pointofsale'
          },
          {
            name: 'Sale Return',
            url: 'salereturnlist'
          },
          {
            name: 'Payments received',
            url: 'paymentrecive'
          }
        ]
      },
      {
        name: 'Purchase',
        is_toggle:true,
        toggled: false,
        icon: '/img/icons/ic_play_shopping_bag_24px.svg',
        menu_items: [
          {
            name: 'Expense',
            url: 'expensebill'
          },
          {
            name: 'Purchase Order',
            url: 'purchaseorderlist'
          },
          {
            name: 'Purchase bills',
            url: 'purchasebill'
          },
          {
            name: 'Purchase Return',
            url: 'returnlist'
          },
          {
            name: 'Payments made',
            url: 'paymade'
          }
        ]
      },
      {
        name : 'Reports',
        is_toggle:true,
        toggled: false,
         url:'reportpage',
        icon: '/img/icons/ic_assessment_24px.svg',
       },
      {
        name: 'Settings',
        is_toggle:true,
        toggled: false,
        icon: '/img/icons/ic_settings_24px.svg',
        menu_items: [
          {
            name: 'Organization Profile',
            url: 'organization'
          },
          {
            name: 'Bank Details',
            url: 'bankdetails'
          },
           {
            name: 'User & Roles',
            url: 'userole'
          },
          {
            name: 'Sales Persons',
            url: 'salesperson'
          },
          {
            name: 'Taxes',
            url: 'taxpage'
          },
          {
            name: 'UOM',
            url: 'uompage'
          },
          {
            name: 'Templates',
            url: 'templates'
          },
          {
            name: 'Configuration',
            url: 'posconfig'
          },
         /** {
            name: 'Data Backup',
            url: 'backup'
          },
          {
            name: 'Data import',
            url: 'import'
          }, **/
          {
            name: 'Renew Licence',
            url: 'renewlicence'
          }

        ]
        },
      ];

    this.getClass = function(url) {

      if('/' + url == $location.path()){
        return "active";
      }
      else {
        return "";
      }

    };

    this.getActiveParent = function(items) {
      return _.find(items, function(value){
        return '/' + value.url == $location.path();
      });
    };

    this.toggle = function(index){
      var $this = this;
      this.menu_sections.map(function(ix, position) {
        var toggle = $this.menu_sections[index].toggled ? false : true;
        $this.menu_sections[position].toggled = position !== index ?  false : toggle;
      });
      $(".main-menu").children("li:nth-child(" + (index + 1) + ")").toggleClass("open").find("ul").stop().slideToggle(function(){
        $(".main-menu").children("li:nth-child(" + (index + 1) + ")").siblings().removeClass("open").find("ul").stop().slideUp();
      });
    };
  }
]).controller('HeaderNavMenu',
  function HeaderNavMenu($mdDialog) {
    var originatorEv;
    this.openMenu = function($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    this.notificationsEnabled = true;
    this.toggleNotifications = function() {
      this.notificationsEnabled = !this.notificationsEnabled;
    };
    this.redial = function() {
      $mdDialog.show(
        $mdDialog.alert()
          .targetEvent(originatorEv)
          .clickOutsideToClose(true)
          .parent('body')
          .title('Suddenly, a redial')
          .content('You just called a friend; who told you the most amazing story. Have a cookie!')
          .ok('That was easy')
      );
      originatorEv = null;
    };
    this.checkVoicemail = function() {
      // This never happens.
    };
  });
