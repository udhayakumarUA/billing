angular.module('posApp')
  .controller('AdditemCtrl', function($scope, $mdToast,$state,$http,Upload) {
    $scope.itemtype='Goods';
    $scope.taxpreference='Taxable';
    $scope.prices=[{
      'salesrate':'',
      'purchaserate':'',
      'mrp':''
    }];
    $http.post('/products/getproductpre').then(function (res) {
      $scope.uoms=res.data.uoms;
      $scope.uoms1=res.data.uoms1;
      $scope.utgsts=res.data.utgsts;
      $scope.cesss=res.data.cesss;
      $scope.igsts=res.data.igsts;
      $scope.cgsts=res.data.cgsts;
      $scope.sgsts=res.data.sgsts;
    });
    $scope.searchcollection=function (search) {
      return $http
        .post('/collection/searchcollection',{searchtext:search})
        .then(function (res) {
          return res.data.collections;

        }).catch(function (err) {
          return [];
        })
    }
    $scope.barcodeScanned = function(barcode) {
      console.log('callback received barcode: ' + barcode);
      $scope.barcode = barcode;
  };
    // $(document).scannerDetection({
    //   onComplete: function(barcode, qty){
    //     console.log(barcode)
    //     console.log(qty)
    //     $scope.barcode=barcode
    //     },
    //     timeBeforeScanTest: 100,
    //     avgTimeByChar: 30,
    //     minLength: 6,
    //     endChar: [9, 13],
    //     startChar: [],
    //     scanButtonKeyCode: false,
    //     scanButtonLongPressThreshold: 3,
    // });
    // $scope.scan_options = {
    //   onComplete: function(barcode){
    //     console.log(barcode)
    //   },
    //     timeBeforeScanTest: 100,
    //     avgTimeByChar: 30,
    //     minLength: 6,
    //     endChar: [9, 13],
    //     startChar: [],
    //     scanButtonKeyCode: false,
    //     scanButtonLongPressThreshold: 3,
    // };
    $scope.generate=function(){
      var length = 13;
      var timestamp = +new Date;
     $scope._getRandomInt = function( min, max ) {
       return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
      }
       var ts = timestamp.toString();
          var parts = ts.split( "" ).reverse();
          var id = "";

          for( var i = 0; i < length; ++i ) {
            var index = $scope._getRandomInt( 0, parts.length - 1 );
            id += parts[index];
          }
      $scope.barcode=id;
    }
    $scope.addproduct=function (files) {
      /*if($scope.taxpreference=='Non-Taxable'){
          $scope.$parent.sgst=0;
          $scope.$parent.cgst=0;
          $scope.$parent.igst=0;
          $scope.$parent.cess=0;
          $scope.$parent.utgst=0;
          $scope.$parent.inclusive=false;
          $scope.$parent.purchaseinclusive=false;
      }*/
      $scope.salesrate=$scope.prices.map(pri=>pri.salesrate);
      $scope.purchaserate=$scope.prices.map(pri=>pri.purchaserate);
      $scope.mrp=$scope.prices.map(pri=>pri.mrp);
      console.log($scope.salesrate)
      if($scope.trackinventary==false){
        $scope.openingstock='';
        $scope.openingstockperrate='';
        $scope.inventoryalert='';
        $scope.openingstock=0;
      }
      if($scope.inclusive==true){
        $scope.cgst=parseFloat(isNaN($scope.cgst)?0:$scope.cgst)
        $scope.sgst=parseFloat(isNaN($scope.sgst)?0:$scope.sgst)
        $scope.igst=parseFloat(isNaN($scope.igst)?0:$scope.igst)
        $scope.cess=parseFloat(isNaN($scope.cess)?0:$scope.cess)
        $scope.totaltax=($scope.cgst+$scope.sgst+$scope.cess);
        for(let num in $scope.prices){
        $scope.prices[num].salesrate=parseFloat($scope.prices[num].salesrate)
        $scope.prices[num].salesrate=parseFloat($scope.prices[num].salesrate/ (($scope.totaltax/100) + 1 ))
        }
      }
      if($scope.purchaseinclusive==true){
        $scope.cgst=parseFloat(isNaN($scope.cgst)?0:$scope.cgst)
        $scope.sgst=parseFloat(isNaN($scope.sgst)?0:$scope.sgst)
        $scope.igst=parseFloat(isNaN($scope.igst)?0:$scope.igst)
        $scope.cess=parseFloat(isNaN($scope.cess)?0:$scope.cess)
        $scope.totaltax1=($scope.cgst+$scope.sgst+$scope.cess);
        for(let nums in $scope.prices){
        $scope.prices[nums].purchaserate=parseFloat($scope.prices[nums].purchaserate)
        $scope.prices[nums].purchaserate=parseFloat($scope.prices[nums].purchaserate/ (($scope.totaltax1/100) + 1 ))
        }
      }
      if(files) {
        Upload.upload({
          url: '/products/addproduct',
          file: files,
          fileName: files.name,
          fileFormDataName: 'avatar',
          params: {
            itemtype: $scope.itemtype,
            productname: $scope.productname,
            unit: $scope.unit,
            collection: $scope.selectedcollection.id,
            sku: $scope.sku,
            hsn: $scope.hsn,
            salesrate: $scope.salesrate,
            purchaserate: $scope.purchaserate,
            mrp: $scope.mrp,
            prices:$scope.prices,
            taxpreference: $scope.taxpreference,
            reason:$scope.reason,
            sgst:isNaN($scope.sgst)?0:$scope.sgst,
            cgst:isNaN($scope.cgst)?0:$scope.cgst,
            igst:isNaN($scope.igst)?0:$scope.igst,
            cess:isNaN($scope.cess)?0:$scope.cess,
            trackinventary: $scope.trackinventary,
            openingstock: $scope.openingstock,
            openingstockperrate: $scope.openingstockperrate,
            barcode: $scope.barcode,
            inclusive:$scope.inclusive,
            purchaseinclusive:$scope.purchaseinclusive,
            inventoryalert:$scope.inventoryalert
          }
        }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).then(function (data, status, headers, config, res) {
          console.log(data);
          $state.go('itempage');
          $scope.success();
          $scope.disabled = false;
        }).catch(function (err) {
          console.log(err);
          $scope.disabled = false;
          $scope.error(err.data.err)
        })
      }
      else{
        if(!$scope.trackinventary){
          $scope.openingstock=0
          $scope.openingstockperrate='';
        $scope.inventoryalert='';
        }
        if($scope.sgst==''||$scope.cgst==''){
          return;
        }
        $http.post('/products/addproduct1',{
          itemtype: $scope.itemtype,
          productname: $scope.productname,
          unit: $scope.unit,
          collection: $scope.selectedcollection.id,
          sku: $scope.sku,
          hsn: $scope.hsn,
          salesrate: $scope.salesrate,
          purchaserate: $scope.purchaserate,
          prices:$scope.prices,
          mrp: $scope.mrp,
          taxpreference: $scope.taxpreference,
          reason:$scope.reason,
          sgst:isNaN($scope.sgst)?0:$scope.sgst,
          cgst:isNaN($scope.cgst)?0:$scope.cgst,
          igst:isNaN($scope.igst)?0:$scope.igst,
          cess:isNaN($scope.cess)?0:$scope.cess,
          trackinventary: $scope.trackinventary,
          openingstock: $scope.openingstock,
          openingstockperrate: $scope.openingstockperrate,
          barcode: $scope.barcode,
          inclusive:$scope.inclusive,
          purchaseinclusive:$scope.purchaseinclusive,
          inventoryalert:$scope.inventoryalert
        }).then(function (res) {
          $state.go('itempage');
          $scope.success();
        }).catch(function (err) {
          $scope.error(err.data.err)
        })
      }
    };
    $scope.getsku=function (id,collectionid) {
      if(!id){
        return
      }
      $http.post('/products/getsku',{id:collectionid}).then(function (res) {
        console.log(res);
        $scope.data=res.data.productno;
        if($scope.data==''){
          $scope.data=0;
        }
        $scope.productno=parseInt($scope.data)+1;
        $scope.sku=id+$scope.productno;

      })
    };
    $scope.addNew=function () {
      console.log($scope.prices)
      $scope.prices.push({
        'salesrate':'',
        'purchaserate':'',
        'mrp':''
      });
    }
    $scope.remove=function (index) {
      if($scope.prices.length==1){
        return
      }
      $scope.prices.splice(index,1);
    };
    $scope.cal =function(){
      var sgst=isNaN($scope.sgst)?0:parseFloat($scope.sgst)
      var cgst=isNaN($scope.cgst)?0:parseFloat($scope.cgst)
      var igst=isNaN($scope.igst)?0:parseFloat($scope.igst)
      var cess=isNaN($scope.cess)?0:parseFloat($scope.cess)
      if($scope.salesrate){
      $scope.salesrates =$scope.salesrate+($scope.salesrate*(sgst+cgst+igst+cess))/100
    }else{$scope.salesrates = 0}
  }
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
          .textContent('Product Added')
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };


  }).directive('barcodeScanner', function() {
    return {
      restrict: 'A',
      scope: {
          callback: '=barcodeScanner',
        },
      link:    function postLink(scope, iElement, iAttrs){
          // Settings
          var zeroCode = 48;
          var nineCode = 57;
          var enterCode = 13;
          var minLength = 3;
          var delay = 300; // ms

          // Variables
          var pressed = false;
          var chars = [];
          var enterPressedLast = false;

          // Timing
          var startTime = undefined;
          var endTime = undefined;

          jQuery(document).keypress(function(e) {
              if (chars.length === 0) {
                  startTime = new Date().getTime();
              } else {
                  endTime = new Date().getTime();
              }
              console.log(e.which)
              // Register characters and enter key
              if (e.which >= zeroCode && e.which <= nineCode) {
                  chars.push(String.fromCharCode(e.which));
              }

              enterPressedLast = (e.which === enterCode);

              if (pressed == false) {
                  setTimeout(function(){
                      if (chars.length >= minLength && enterPressedLast) {
                          var barcode = chars.join('');
                          //console.log('barcode : ' + barcode + ', scan time (ms): ' + (endTime - startTime));

                          if (angular.isFunction(scope.callback)) {
                              scope.$apply(function() {
                                  scope.callback(barcode);
                              });
                          }
                      }
                      chars = [];
                      pressed = false;
                  },delay);
              }
              pressed = true;
          });
          scope.$on('$destroy', function () {

              angular.element(document).off('keypress');
            });
      }
    };
  });
