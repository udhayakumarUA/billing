'use strict';
angular.module('posApp', [
  'ui.router',
  'ngMaterial',
  'app.config',
  'ngMessages',
  'ngFileUpload',
  'cl.paging',
  'angular-barcode',
  'chart.js',
  'scanner.detection',
  'cfp.hotkeys'
])
  .run(["$rootScope", "$location", "$mdColorPalette","verifyservice",
    function ($rootScope, $location, $mdColorPalette,verifyservice) {
    console.log('enter');
      $rootScope.app_name = "POS";
      $rootScope.getMaterialColor = function (base, shade) {
        var color = $mdColorPalette[base][shade].value;
        return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
      };
      $rootScope.RGB2HTML = function (rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
          ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
      };

       $rootScope.$on('$stateChangeStart', function (event, toState,toParams, fromState){
        console.log(fromState)
        $rootScope.fromestate = fromState.name
        console.log($rootScope.fromestate )
        if(toState.data.hidden==true){
           console.log(toState.data.hidden)
           $rootScope.hide=true;
         }
         else{
           $rootScope.hide=false;
         }
         $rootScope.role=localStorage.getItem('role')
         $rootScope.clientid=localStorage.getItem('clientid')
         verifyservice.checkuser().then(function (data) {
       var date=new Date(data.date)
           var date1=new Date(Date.now())
       $rootScope.key=data.key;
       localStorage.setItem('key',data.key)
       console.log(data.key)
       $rootScope.myexpire=data.date
         if(toState.data.authenticated==true&&data.verify==false){
           $location.path('/verifykey')
         }
         else if(toState.data.authenticated==true&&date1>date){
           $location.path('/expire')
         }
        else if(toState.data.authenticated==true&&!localStorage.getItem('key')){
           $location.path('/login')
         }

         else if(toState.data.authenticated==true&&toState.data.biller==true&&$rootScope.role=="B"){
          $location.path('/pointofsale')
        }
         })
       });

    }])
  .config(function ($stateProvider, $urlRouterProvider,$locationProvider) {
    $locationProvider.html5Mode(true);
    // $urlRouterProvider.otherwise('/');
  //   $urlRouterProvider.otherwise(function($injector,$rootScope, $location){
  //     // var state = $injector.get('$state');
  //     console.log('check');
  //     console.log($rootScope.role)
  //     if($rootScope.role=='B')
  //       state.go('pointofsale');
  //     else
  //       state.go('/');
  //     return $location.path();
  //  });
    $stateProvider
    .state('signin', {
        url:'/login',
        templateUrl: 'templates/pages/signin.html',
        controller:'LoginCtrl',
        data:{authenticated:false,hidden:true}
      })
    // .state('signup', {
    //     url:'/signup',
    //     templateUrl: 'templates/pages/signup.html',
    //     controller:''
    //   })
      .state('verifykey', {
        url:'/verifykey',
        templateUrl: 'templates/pages/verifykey.html',
        controller:'VerifyCtrl',
        data:{authenticated:false,hidden:true}
      })
      .state('expire', {
        url:'/expire',
        templateUrl: 'templates/pages/expires.html',
        controller:'ExpireCtrl',
        data:{authenticated:false,hidden:true}
      })
    .state('change', {
        url:'/changepassword',
        templateUrl: 'templates/pages/changepassword.html',
        controller:'ChangepassCtrl',
      data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })
     .state('header', {
       url:'/header',
      templateUrl: 'templates/header.html',
      controller: 'HeaderCtrl'
       })
      .state('navigation', {
        url:'/navigation',
        templateUrl: 'templates/navigation.html',
        controller: 'NavigationCtrl'
      })
      .state('dashboard', {
       url:'/',
       templateUrl: 'templates/dashboard/dashboard.html',
       controller: 'dashboardCtrl',
        data:{authenticated:true,hidden:false}
       })

      .state('organization', {
        url:'/organization',
        templateUrl: 'templates/settings/organization.html',
        controller:'OrganCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('bankdetails', {
        url:'/bankdetails',
        templateUrl: 'templates/settings/bankdetails.html',
        controller:'bankdetailsCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('help', {
        url:'/help',
        templateUrl: 'templates/help/help.html',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('additem', {
        url:'/additem',
        templateUrl: 'templates/item/additem.html',
        controller:'AdditemCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('edititem', {
        url:'/edititem/:id',
        templateUrl: 'templates/item/edititem.html',
        controller:'ProdeditCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('singleitem', {
        url:'/singleitem/:id',
        templateUrl: 'templates/item/singleitem.html',
        controller:'SingleitemCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('itempage', {
        url:'/itempage',
        templateUrl: 'templates/item/item.html',
        controller:'ItempageCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('inventory', {
        url:'/inventory',
        templateUrl: 'templates/item/inventory.html',
        controller:'InventoryListCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('inventory-adjustment', {
        url:'/inventory-adjustment/',
        templateUrl: 'templates/item/inventory-adjustment.html',
        controller:'AddInventoryadjustmentCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('editinventoryadjustment', {
        url:'/edit_inventory_adjustment/:id',
        templateUrl: 'templates/item/edit_inventory_adjustment.html',
        controller:'AddInventoryadjustmentCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('singleinventoryadjustment', {
        url:'/single_inventory_adjustment/:id',
        templateUrl: 'templates/item/single_inventory_adjustment.html',
        controller:'SingleinventoryCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('addcontact', {
        url:'/addcontact',
        templateUrl: 'templates/contact/addcontact.html',
        controller:'AddscontactCtrl',
        data:{authenticated:true,grantAccessTo:['A']},hidden:false
      })
      .state('editcontact', {
        url:'/editcontact/:id',
        templateUrl: 'templates/contact/editcontact.html',
         controller:'SinglecontactCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('singlecontact', {
        url:'/singlecontact/:id',
        templateUrl: 'templates/contact/single_contact.html',
        controller:'SinglecontactCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('contactpage', {
        url:'/contactpage',
        templateUrl: 'templates/contact/contactpage.html',
        controller:'AddscontactCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('userole', {
        url:'/user_role',
        templateUrl: 'templates/settings/user_role.html',
        controller:'useroleCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('salesperson', {
        url:'/salesperson',
        templateUrl: 'templates/settings/salesperson.html',
        controller:'SalespersonCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('salespersonsingle', {
        url:'/salespersonsingle/:id',
        templateUrl: 'templates/settings/salespersonsingle.html',
        controller:'SalespersonsingleCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('uompage', {
        url:'/uompage',
        templateUrl: 'templates/settings/uompage.html',
        controller:'uomCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('templates', {
        url:'/templates',
        templateUrl: 'templates/settings/templates.html',
        data:{authenticated:true,hidden:false},
        controller:'TemplatesCtrl'
      })
       .state('taxpage', {
        url:'/taxpage',
        templateUrl: 'templates/settings/taxpage.html',
        controller:'taxCtrl',
         data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
       .state('posconfig', {
        url:'/posconfig',
        templateUrl: 'templates/settings/posconfig.html',
        controller:'PosconfigCtrl',
         data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
       .state('backup', {
        url:'/backup',
        templateUrl: 'templates/settings/backup.html',
        controller:'',
         data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('import', {
        url:'/import',
        templateUrl: 'templates/settings/import.html',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('paymentrecive', {
        url:'/paymentreceive',
        templateUrl: 'templates/sales/paymentrecive.html',
        controller:'PaymentrecpageCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('singlereceive', {
        url:'/singlereceive/:id',
        templateUrl: 'templates/sales/paymentreceive_single.html',
        controller:'singlereceiveCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('estimate', {
        url:'/estimate',
        templateUrl: 'templates/sales/estimate.html',
        controller:'estimateCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('estimatepage', {
        url:'/estimatepage',
        templateUrl: 'templates/sales/estimatepage.html',
        controller:'EstimatepageCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('estimatesingle', {
        url:'/estimatesingle/:id',
        templateUrl: 'templates/sales/estimatesingle.html',
        controller:'EstimatepageCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('editestimate', {
        url:'/editestimate/:key/:id',
        templateUrl: 'templates/sales/editestimate.html',
        controller:'estimateCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('salesorder', {
        url:'/salesorder',
        templateUrl: 'templates/sales/salesorder/salesorderlist.html',
        controller:'singlesalesorderCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('newsalesorder', {
        url:'/newsalesorder',
        templateUrl: 'templates/sales/salesorder/newsalesorder.html',
        controller:'salesorderCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('salesordersingle', {
        url:'/salesordersingle/:id',
        templateUrl: 'templates/sales/salesorder/salesordersingle.html',
        controller:'singlesalesorderCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('editsalesorder', {
        url:'/editsalesorder/:key/:id',
        templateUrl: 'templates/sales/salesorder/editsalesorder.html',
        controller:'salesorderCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('invoice', {
        url:'/invoice/:id/:name',
        templateUrl: 'templates/sales/invoice.html',
        controller:'invoiceCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('invoiceedit', {
        url:'/invoiceedit/:posid',
        templateUrl: 'templates/sales/invoiceedit.html',
        controller:'InvoiceeditCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('invoicesingle', {
        url:'/invoicesingle/:posid',
        templateUrl: 'templates/sales/invoicesingle.html',
        controller:'SingleposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('paymentreceived', {
        url:'/paymentreceived/:id',
        templateUrl: 'templates/sales/payment_received.html',
        controller:'paymentrecCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
       .state('pointofsale', {
        url:'/pointofsale',
        templateUrl: 'templates/sales/pointofsale.html',
        controller:'PointofsaleCtrl',
         data:{authenticated:true,grantAccessTo:['A'],hidden:false,biller:true}
      })
      .state('pos', {
        url:'/pos',
        templateUrl: 'templates/sales/pos.html',
        controller:'posCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('singlepos', {
        url:'/singlepos/:posid',
        templateUrl: 'templates/sales/singlepos.html',
        controller:'SingleposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('salereturnlist', {
        url:'/salereturnlist',
        templateUrl: 'templates/sales/salereturnlist.html',
        controller:'salereturnlistCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('newsalereturn', {
        url:'/newsalereturn',
        templateUrl: 'templates/sales/newsalereturn.html',
        controller:'newsalereturnCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('singlesalereturn', {
        url:'/singlesalereturn/:sid',
        templateUrl: 'templates/sales/singlesalereturn.html',
        controller:'singlesalereturnCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('salereturnedit', {
        url:'/salereturnedit/:sid',
        templateUrl: 'templates/sales/salereturnedit.html',
        controller:'salereturneditCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })



      .state('paymentmade', {
          url:'/paymentmade/:id',
          templateUrl: 'templates/purchase/payment_made.html',
          controller:'paymentmadeCtrl',
          data:{authenticated:true,grantAccessTo:['A'],hidden:false}
        })

      .state('newpurchasebill', {
        url:'/newpurchasebill/:id/:name',
        templateUrl: 'templates/purchase/purchase_bill.html',
        controller:'purchaseCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('billsingle', {
        url:'/billsingle/:pid',
        templateUrl: 'templates/purchase/billsingle.html',
        controller:'SinglepurchaseCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('billedit', {
        url:'/billedit/:pid',
        templateUrl: 'templates/purchase/billedit.html',
        controller:'billeditCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })


      .state('purchaseorderlist', {
        url:'/purchaseorderlist',
        templateUrl: 'templates/purchase/purchaseorderlist.html',
        controller:'purchaseorderlistCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('purchaseorder', {
        url:'/purchaseorder',
        templateUrl: 'templates/purchase/purchaseorder.html',
        controller:'purchaseorderCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('purchaseorderedit', {
        url:'/purchaseorderCtrl/:key/:id',
        templateUrl: 'templates/purchase/purchaseorderedit.html',
        controller:'purchaseorderCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('purchaseordersingle', {
        url:'/purchaseordersingle/:id',
        templateUrl: 'templates/purchase/purchaseordersingle.html',
        controller:'purchaseorderlistCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })



      .state('newexpenses', {
        url:'/newexpenses',
        templateUrl: 'templates/purchase/newexpenses.html',
        controller:'expensesCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('editexpenses', {
        url:'/editexpenses/:expid',
        templateUrl: 'templates/purchase/editexpenses.html',
        controller:'EditexpenseCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('singleexpenses', {
        url:'/singleexpenses/:expid',
        templateUrl: 'templates/purchase/singleexpenses.html',
        controller:'EditexpenseCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('returnlist', {
        url:'/returnlist',
        templateUrl: 'templates/purchase/returnlist.html',
        controller:'returnlistCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('newreturnbill', {
        url:'/newreturnbill',
        controller:'returnCtrl',
        templateUrl: 'templates/purchase/newreturnbill.html',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('singlereturn', {
        url:'/singlereturn/:pid',
        templateUrl: 'templates/purchase/singlereturn.html',
        controller:'SinglereturnCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('returnedit', {
        url:'/returnedit/:pid',
        templateUrl: 'templates/purchase/returnedit.html',
        controller:'returneditCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

       .state('purchasebill', {
        url:'/purchasebill',
        templateUrl: 'templates/purchase/purchasebill.html',
        controller:'purchaselistCtrl',
         data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
       .state('expensebill', {
        url:'/expensebill',
        templateUrl: 'templates/purchase/expense.html',
        controller:'expensesCtrl',
         data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
       .state('paymade', {
        url:'/paymade',
        templateUrl: 'templates/purchase/paymentmad.html',
        controller:'paymentmadepageCtrl',
         data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('singlepaymade', {
        url:'/singlepaymade/:id',
        templateUrl: 'templates/purchase/singlepaymade.html',
        controller:'singlepaymadeCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
        .state('reportpage', {
        url:'/reportpage',
        templateUrl: 'templates/reports/report.html',
        controller:'',
          data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    // reports
    .state('daybookreport', {
      url:'/daybookreport',
      templateUrl: 'templates/reports/daybookreport/daybookreport.html',
      controller:'ReportposCtrl',
     data:{authenticated:true,grantAccessTo:['A'],hidden:false}
    })
    .state('profitorloss', {
      url:'/profitorloss',
      templateUrl: 'templates/reports/daybookreport/profitorloss.html',
      controller:'ReportposCtrl',
     data:{authenticated:true,grantAccessTo:['A'],hidden:false}
    })
    .state('salebycustomer', {
        url:'/salebycus',
        templateUrl: 'templates/reports/sale/salebycust.html',
        controller:'ReportposCtrl',
       data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    .state('salebyitem', {
        url:'/salebyitem',
        templateUrl: 'templates/reports/sale/salebyitem.html',
        controller:'ReportposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

    .state('salebysinglecus', {
        url:'/salebysinglecustomer',
        templateUrl: 'templates/reports/sale/salebysinglecust.html',
        controller:'ReportposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

    .state('detailedgstreport', {
      url:'/detailedgstreport',
      templateUrl: 'templates/reports/sale/detailedgst.html',
      controller:'ReportposCtrl',
      data:{authenticated:true,grantAccessTo:['A'],hidden:false}
    })

    .state('retailgst', {
        url:'/retailgst',
        templateUrl: 'templates/reports/sale/retailgst.html',
        controller:'RetailgstCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    .state('purchasebyvendor', {
        url:'/purchasebyvendor',
        templateUrl: 'templates/reports/purchases/purchasevendor.html',
        controller:'purchasereportCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    .state('purchasebyitem', {
        url:'/purchasebyitem',
        templateUrl: 'templates/reports/purchases/purchaseitem.html',
        controller:'purchasereportCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('stockalert', {
        url:'/stockalertlist',
        templateUrl: 'templates/stockalert/stockalert.html',
        controller:'StockalertCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('overduepayment', {
        url:'/overduepaymentlist',
        templateUrl: 'templates/overdue.html',
        controller:'OverduePayment',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('saledetails', {
        url:'/saledetails/:type',
        templateUrl: 'templates/dashboard/saledetails.html',
        controller:'saledetails',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('returnbyitem', {
        url:'/returnbyitem',
        templateUrl: 'templates/reports/purchases/returnbyitem.html',
        // controller:'purchasereportCtrl',
        controller:'ReportreturnCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('purchasereturnreport', {
        url:'/purchasereturnreport',
        templateUrl: 'templates/reports/purchases/purchasereturn.html',
        // controller:'purchasereportCtrl',
        controller:'ReportreturnCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('salereturn', {
        url:'/salereturn',
        templateUrl: 'templates/reports/sale/return.html',
        controller:'ReportreturnCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('salereturnreport', {
        url:'/salereturnreport',
        templateUrl: 'templates/reports/sale/salereturn.html',
        controller:'ReportreturnCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

      .state('saleuserreport', {
        url:'/saleuserreport',
        templateUrl: 'templates/reports/sale/salebyuser.html',
        controller:'ReportposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('salesorderreport', {
        url:'/salesorderreport',
        templateUrl: 'templates/reports/sale/salesorder.html',
        controller:'ReportSalesOrderCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    .state('purchasebysinglevendor', {
        url:'/purchasebysingleitem',
        templateUrl: 'templates/reports/purchases/purchasesiglven.html',
        controller:'',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    .state('gstpurreport', {
        url:'/gstpurchasereport',
        templateUrl: 'templates/reports/purchases/gstpurchase.html',
        controller:'purchasereportCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    .state('expensebydet', {
        url:'/expensebydetail',
        templateUrl: 'templates/reports/expenses/expensedet.html',
        controller:'ReportexpenseCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
    .state('expensebycat', {
        url:'/expensebycategory',
        templateUrl: 'templates/reports/expenses/expensebycat.html',
        controller:'ReportexpenseCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      //Expense by single Category report page
      .state('expenseBySingleCategory', {
        url:'/expense-by-single-category',
        templateUrl: 'templates/reports/expenses/expenseBySingleCat.html',
        controller:'ReportexpenseCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })

     .state('customerbal', {
        url:'/customerbalance',
        templateUrl: 'templates/reports/receivables/customerbal.html',
        controller:'ReportposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('billdetails', {
        url:'/billdetails',
        templateUrl: 'templates/reports/receivables/billdetails.html',
        controller:'ReportposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('paymentrec', {
        url:'/paymentrec',
        templateUrl: 'templates/reports/receivables/paymentreceived.html',
        controller:'ReportposCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('vendorbal', {
        url:'/vendorbalance',
        templateUrl: 'templates/reports/payables/vendorbal.html',
        controller:'purchasereportCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('purchasebilld', {
        url:'/purchasebilldetail',
        templateUrl: 'templates/reports/payables/purbilldet.html',
        controller:'purchasereportCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('paymemade', {
        url:'/paymemade',
        templateUrl: 'templates/reports/payables/paymentmadee.html',
        controller:'purchasereportCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('inventorysummary', {
        url:'/inventorysummary',
        templateUrl: 'templates/reports/inventory/inventorysum.html',
        controller:'inventoryCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('inventoryadjustment', {
        url:'/inventoryadjustment',
        templateUrl: 'templates/reports/inventory/inventoryAdjustment.html',
        controller:'inventoryCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('barcodegenerate', {
        url:'/Barcodegenerate',
        templateUrl: 'templates/item/bargenerate.html',
        controller:'bargenCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('barcodeprint', {
        url:'/barcodeprint',
        templateUrl: 'templates/item/barcodeprint.html',
        controller:'bargenCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('collections', {
        url:'/collections',
        templateUrl: 'templates/item/collections.html',
        controller:'collectionsCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('addcollection', {
        url:'/addcollection',
        templateUrl: 'templates/item/addcollection.html',
        controller:'AddcollectionCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('renewlicence', {
        url:'/renewlicence',
        templateUrl: 'templates/settings/renewlicence.html',
        controller:'RenewCtrl',
        data:{authenticated:true,grantAccessTo:['A'],hidden:false}
      })
      .state('pos_standard', {
        url:'/posstandard/:posid',
        templateUrl: 'templates/templates/pos/pos_standard.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('pos3inch', {
        url:'/pos3inch/:posid',
        templateUrl: 'templates/templates/pos/pos_3inch.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('pos2inch', {
        url:'/pos2inch/:posid',
        templateUrl: 'templates/templates/pos/pos_2inch.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('pos2inch1', {
        url:'/pos2inch1/:posid',
        templateUrl: 'templates/templates/pos/pos_2inch1.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('delivery', {
        url:'/delivery/:posid',
        templateUrl: 'templates/templates/pos/delivery.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
          },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('packing', {
        url:'/packing/:posid',
        templateUrl: 'templates/templates/pos/packing.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('posa4', {
        url:'/posa4/:posid',
        templateUrl: 'templates/templates/pos/posa4.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })



      .state('posa4spreadtheet', {
        url:'/posa4spreadtheet/:posid',
        templateUrl: 'templates/templates/pos/posa4spreadtheet.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('posa4lite', {
        url:'/posa4lite/:posid',
        templateUrl: 'templates/templates/pos/posa4lite.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })


      .state('posa4lite1', {
        url:'/posa4lite1/:posid',
        templateUrl: 'templates/templates/pos/posa4lite1.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })


      .state('posa4customer', {
        url:'/posa4customer/:posid',
        templateUrl: 'templates/templates/pos/customer.html',
        controller:'posstandardCtrl',
        resolve: {
          pos: function($stateParams, $http,$rootScope) {
            return $http.post('/pos/singlepostemp', {posid: $stateParams.posid, key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('salesorder4inch', {
        url:'/salesorder4inch/:id',
        templateUrl: 'templates/templates/sales_order/salesorder_4inch.html',
        controller:'salesorderstandardCtrl',
        resolve: {
          salesorder: function($stateParams, $http,$rootScope) {
            return $http.post('/salesorder/singlesalesorder', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('salesorder3inch', {
        url:'/salesorder3inch/:id',
        templateUrl: 'templates/templates/sales_order/salesorder_3inch.html',
        controller:'salesorderstandardCtrl',
        resolve: {
          salesorder: function($stateParams, $http,$rootScope) {
            return $http.post('/salesorder/singlesalesorder', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('salesorder2inch', {
        url:'/salesorder2inch/:id',
        templateUrl: 'templates/templates/sales_order/salesorder_2inch.html',
        controller:'salesorderstandardCtrl',
        resolve: {
          salesorder: function($stateParams, $http,$rootScope) {
            return $http.post('/salesorder/singlesalesorder', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('salesordera4', {
        url:'/salesordera4/:id',
        templateUrl: 'templates/templates/sales_order/salesorder_a4.html',
        controller:'salesorderstandardCtrl',
        resolve: {
          salesorder: function($stateParams, $http,$rootScope) {
            return $http.post('/salesorder/singlesalesorder', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('salesordera4spreadtheet', {
        url:'/salesordera4spreadtheet/:id',
        templateUrl: 'templates/templates/sales_order/salesordera4_spreadtheet.html',
        controller:'salesorderstandardCtrl',
        resolve: {
          salesorder: function($stateParams, $http,$rootScope) {
            return $http.post('/salesorder/singlesalesorder', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('salesordera4lite', {
        url:'/salesordera4lite/:id',
        templateUrl: 'templates/templates/sales_order/salesordera4_lite.html',
        controller:'salesorderstandardCtrl',
        resolve: {
          salesorder: function($stateParams, $http,$rootScope) {
            return $http.post('/salesorder/singlesalesorder', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('estimatea4', {
        url:'/estimatea4/:id',
        templateUrl: 'templates/templates/estimate/estimate_a4.html',
        controller:'eststandardCtrl',
        resolve: {
          estimate: function($stateParams, $http,$rootScope) {
            return $http.post('/estimate/singleestimate', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('est4inch', {
        url:'/est4inch/:id',
        templateUrl: 'templates/templates/estimate/est_4inch.html',
        controller:'eststandardCtrl',
        resolve: {
          estimate: function($stateParams, $http,$rootScope) {
            return $http.post('/estimate/singleestimate', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('est3inch', {
        url:'/est3inch/:id',
        templateUrl: 'templates/templates/estimate/est_3inch.html',
        controller:'eststandardCtrl',
        resolve: {
          estimate: function($stateParams, $http,$rootScope) {
            return $http.post('/estimate/singleestimate', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('est2inch', {
        url:'/est2inch/:id',
        templateUrl: 'templates/templates/estimate/est_2inch.html',
        controller:'eststandardCtrl',
        resolve: {
          estimate: function($stateParams, $http,$rootScope) {
            return $http.post('/estimate/singleestimate', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('esta4spreadtheet', {
        url:'/esta4spreadtheet/:id',
        templateUrl: 'templates/templates/estimate/esta4_spreadtheet.html',
        controller:'eststandardCtrl',
        resolve: {
          estimate: function($stateParams, $http,$rootScope) {
            return $http.post('/estimate/singleestimate', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('esta4lite', {
        url:'/esta4lite/:id',
        templateUrl: 'templates/templates/estimate/esta4lite.html',
        controller:'eststandardCtrl',
        resolve: {
          estimate: function($stateParams, $http,$rootScope) {
            return $http.post('/estimate/singleestimate', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('purchasea4', {
        url:'/purchasea4/:pid',
        templateUrl: 'templates/templates/purchase/purchase_a4.html',
        controller:'purchstandardCtrl',
        resolve: {
          purchase: function($stateParams, $http,$rootScope) {
            return $http.post('/purchase/singlepurchasetemp', {pid: $stateParams.pid,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })
      .state('purchasea4inch', {
        url:'/purchasea4inch/:pid',
        templateUrl: 'templates/templates/purchase/purchase_4inch.html',
        controller:'purchstandardCtrl',
        resolve: {
          purchase: function($stateParams, $http,$rootScope) {
            return $http.post('/purchase/singlepurchasetemp', {pid: $stateParams.pid,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })
      .state('purchasea3inch', {
        url:'/purchasea3inch/:pid',
        templateUrl: 'templates/templates/purchase/purhase_3inch.html',
        controller:'purchstandardCtrl',
        resolve: {
          purchase: function($stateParams, $http,$rootScope) {
            return $http.post('/purchase/singlepurchasetemp', {pid: $stateParams.pid,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })
      .state('purchasea2inch', {
        url:'/purchasea2inch/:pid',
        templateUrl: 'templates/templates/purchase/purhase_2inch.html',
        controller:'purchstandardCtrl',
        resolve: {
          purchase: function($stateParams, $http,$rootScope) {
            return $http.post('/purchase/singlepurchasetemp', {pid: $stateParams.pid,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('pura2spreadtheet', {
        url:'/pura2spreadtheet/:pid',
        templateUrl: 'templates/templates/purchase/pura2spreadtheet.html',
        controller:'purchstandardCtrl',
        resolve: {
          purchase: function($stateParams, $http,$rootScope) {
            return $http.post('/purchase/singlepurchasetemp', {pid: $stateParams.pid,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })


      .state('pura2lite', {
        url:'/pura2lite/:pid',
        templateUrl: 'templates/templates/purchase/pura2lite.html',
        controller:'purchstandardCtrl',
        resolve: {
          purchase: function($stateParams, $http,$rootScope) {
            return $http.post('/purchase/singlepurchasetemp', {pid: $stateParams.pid,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })


      .state('purordera2inch', {
        url:'/purordera2inch/:id',
        templateUrl: 'templates/templates/purchase_order/purhase_order_2inch.html',
        controller:'purchorderCtrl',
        resolve: {
          purchaseorder: function($stateParams, $http,$rootScope) {
            return $http.post('/purchaseorder/singlepurchasetemp', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('purordera3inch', {
        url:'/purordera3inch/:id',
        templateUrl: 'templates/templates/purchase_order/purhase_order_3inch.html',
        controller:'purchorderCtrl',
        resolve: {
          purchaseorder: function($stateParams, $http,$rootScope) {
            return $http.post('/purchaseorder/singlepurchasetemp', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('purordera4inch', {
        url:'/purordera4inch/:id',
        templateUrl: 'templates/templates/purchase_order/purhase_order_4inch.html',
        controller:'purchorderCtrl',
        resolve: {
          purchaseorder: function($stateParams, $http,$rootScope) {
            return $http.post('/purchaseorder/singlepurchasetemp', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('purordera4', {
        url:'/purordera4/:id',
        templateUrl: 'templates/templates/purchase_order/purhase_order_a4.html',
        controller:'purchorderCtrl',
        resolve: {
          purchaseorder: function($stateParams, $http,$rootScope) {
            return $http.post('/purchaseorder/singlepurchasetemp', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('purorderspreadstheet', {
        url:'/purorderspreadstheet/:id',
        templateUrl: 'templates/templates/purchase_order/purhase_order_spreadstheet.html',
        controller:'purchorderCtrl',
        resolve: {
          purchaseorder: function($stateParams, $http,$rootScope) {
            return $http.post('/purchaseorder/singlepurchasetemp', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })

      .state('purorderlite', {
        url:'/purorderlite/:id',
        templateUrl: 'templates/templates/purchase_order/purhase_order_lite.html',
        controller:'purchorderCtrl',
        resolve: {
          purchaseorder: function($stateParams, $http,$rootScope) {
            return $http.post('/purchaseorder/singlepurchasetemp', {id: $stateParams.id,key: localStorage.getItem('key')}).then(function (res) {
              return res.data
            })
          }
        },
        data:{authenticated:true,grantAccessTo:['A'],hidden:true}
      })


      .state('printbarcode', {
        url:'/printbarcode/:myParam',
        templateUrl: 'templates/templates/printbarcode.html',
        controller:'BarcodeCtrl',
        data:{authenticated:true,grantAccessTo:['A']}
      })



  }).config(function ($mdThemingProvider, $mdGestureProvider, config) {

  $mdThemingProvider.alwaysWatchTheme(true);

  $mdGestureProvider.skipClickHijack();

  $mdThemingProvider.theme('default')
    .primaryPalette(config.md_primary.base, {
      'default': config.md_primary.shade
    })
    .accentPalette(config.md_accent.base, {
      'default': config.md_accent.shade
    });
});




