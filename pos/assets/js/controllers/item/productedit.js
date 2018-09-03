angular.module('posApp')
  .controller('ProdeditCtrl', function($scope,$state,Upload, $mdDialog,verifyDelete,$stateParams,$mdToast,$http) {
    $scope.count=0;
    $http.post('/products/productedit',{id:$stateParams.id}).then(function (res) {
      console.log(res)
      if(!res.data.product.prices)
      res.data.product.prices = [{'salesrate':res.data.product.salesrate,'purchaserate':res.data.product.purchaserate,'mrp':''}]
      $scope.product=res.data.product;
      $scope.prices=res.data.product.prices;
       console.log($scope.product)
      if(res.data.product.inclusive==true){
        for(let num in res.data.product.prices){
      $scope.rate = parseFloat($scope.product.prices[num].salesrate);
      console.log($scope.rate)
      $scope.product.cgst=parseFloat(isNaN($scope.product.cgst)?0:$scope.product.cgst)
      $scope.product.sgst=parseFloat(isNaN($scope.product.sgst)?0:$scope.product.sgst)
      $scope.product.igst=parseFloat(isNaN($scope.product.igst)?0:$scope.product.igst)
      $scope.product.cess=parseFloat(isNaN($scope.product.cess)?0:$scope.product.cess)
      $scope.singlecgst1=($scope.rate * $scope.product.cgst)/100;
      $scope.singlesgst1=($scope.rate * $scope.product.sgst)/100;
      $scope.singleigst1=($scope.rate * $scope.product.igst)/100;
      $scope.singlecess1=($scope.rate * $scope.product.cess)/100;
      $scope.totaltax1=($scope.singlecgst1+$scope.singlesgst1+$scope.singlecess1);
      console.log($scope.totaltax1)
      $scope.product.prices[num].salesrate=($scope.rate+$scope.totaltax1);
      // $scope.salesrate=$scope.salesrate
        }
    }
    // else{
    //   // $scope.salesrate = res.data.product.salesrate;
    //   $scope.prices = res.data.product.prices;
    // }
    if(res.data.product.purchaseinclusive==true){
      for(let nums in res.data.product.prices){
      $scope.purrate = parseFloat(res.data.product.prices[nums].purchaserate);
      $scope.product.cgst=parseFloat(isNaN($scope.product.cgst)?0:$scope.product.cgst)
      $scope.product.sgst=parseFloat(isNaN($scope.product.sgst)?0:$scope.product.sgst)
      $scope.product.igst=parseFloat(isNaN($scope.product.igst)?0:$scope.product.igst)
      $scope.product.cess=parseFloat(isNaN($scope.product.cess)?0:$scope.product.cess)
      $scope.singlecgst2=($scope.purrate * $scope.product.cgst)/100;
      $scope.singlesgst2=($scope.purrate * $scope.product.sgst)/100;
      $scope.singleigst2=($scope.purrate * $scope.product.igst)/100;
      $scope.singlecess2=($scope.purrate * $scope.product.cess)/100;
      $scope.totaltax2=($scope.singlecgst2+$scope.singlesgst2+$scope.singlecess2);
      console.log($scope.totaltax2)
      $scope.prices[nums].purchaserate=$scope.purrate+$scope.totaltax2;
      $scope.product.prices[nums].purchaserate=$scope.prices[nums].purchaserate
      // $scope.prices[nums].purchaserate=$scope.rate+$scope.totaltax2;
      }
    }
    // else{
    //   $scope.product.purchaserate = res.data.product.purchaserate;
    // }
      $scope.selectedcollection=res.data.product.collection;
      $scope.uoms=res.data.uoms;
      $scope.uoms1=res.data.uoms1;
      $scope.utgsts=res.data.utgsts;
      $scope.cesss=res.data.cesss;
      $scope.igsts=res.data.igsts;
      $scope.cgsts=res.data.cgsts;
      $scope.sgsts=res.data.sgsts;
      
    });
    $scope.update=function (files,id) {
      if($scope.product.taxpreference=='Non-Taxable'){
        $scope.product.sgst=0;
        $scope.product.cgst=0;
        $scope.product.igst=0;
        $scope.product.cess=0;
        $scope.product.utgst=0;
        $scope.product.inclusive=false;
        $scope.product.purchaseinclusive=false;
      }
      if($scope.product.trackinventary==false){
        $scope.product.openingstock='';
        $scope.product.openingstockperrate='';
        $scope.product.inventoryalert='';
      }
      $scope.salesrate=$scope.prices.map(pri=>pri.salesrate);
      $scope.purchaserate=$scope.prices.map(pri=>pri.purchaserate);
      $scope.mrp=$scope.prices.map(pri=>pri.mrp);
      if($scope.product.inclusive==true){
        $scope.product.cgst=parseFloat(isNaN($scope.product.cgst)?0:$scope.product.cgst)
        $scope.product.sgst=parseFloat(isNaN($scope.product.sgst)?0:$scope.product.sgst)
        $scope.product.igst=parseFloat(isNaN($scope.product.igst)?0:$scope.product.igst)
        $scope.product.cess=parseFloat(isNaN($scope.product.cess)?0:$scope.product.cess)
        $scope.totaltax=($scope.product.cgst+$scope.product.sgst+$scope.product.cess);
        for(let num in $scope.product.prices){
          $scope.product.prices[num].salesrate=parseFloat($scope.product.prices[num].salesrate)
          $scope.product.prices[num].salesrate=parseFloat($scope.product.prices[num].salesrate/ (($scope.totaltax/100) + 1 ))
          }
      }
      if($scope.product.purchaseinclusive==true){
        $scope.purrate=parseFloat($scope.product.purchaserate)
        $scope.product.cgst=parseFloat(isNaN($scope.product.cgst)?0:$scope.product.cgst)
        $scope.product.sgst=parseFloat(isNaN($scope.product.sgst)?0:$scope.product.sgst)
        $scope.product.igst=parseFloat(isNaN($scope.product.igst)?0:$scope.product.igst)
        $scope.product.cess=parseFloat(isNaN($scope.product.cess)?0:$scope.product.cess)
        $scope.totaltax1=($scope.product.cgst+$scope.product.sgst+$scope.product.cess);
        for(let num in $scope.product.prices){
          $scope.product.prices[num].purchaserate=parseFloat($scope.product.prices[num].purchaserate)
          $scope.product.prices[num].purchaserate=parseFloat($scope.product.prices[num].purchaserate/ (($scope.totaltax1/100) + 1 ))
          }
        // $scope.product.purchaserate=parseFloat($scope.purrate/ (($scope.totaltax1/100) + 1 ))
      }
  
      if(files) {
        Upload.upload({
          url: '/products/updateproduct',
          file: files,
          fileName: files.name,
          fileFormDataName: 'avatar',
          params: {
            itemtype: $scope.product.itemtype,
            productname: $scope.product.productname,
            unit: $scope.product.unit,
            collection: $scope.selectedcollection.id,
            sku: $scope.product.sku,
            hsn: $scope.product.hsn,
            salesrate: $scope.prices[0].salesrate,
            purchaserate: $scope.product.purchaserate,
            mrp: $scope.mrp,
            prices:$scope.prices,
            taxpreference: $scope.product.taxpreference,
            reason:$scope.product.reason,
            sgst:$scope.product.sgst,
            cgst:$scope.product.cgst,
            igst:$scope.product.igst,
            cess:$scope.product.cess,
            utgst:$scope.product.utgst,
            trackinventary: $scope.product.trackinventary,
            openingstock: $scope.product.openingstock,
            openingstockperrate: $scope.product.openingstockperrate,
            barcode: $scope.product.barcode,
            id:id,
            inclusive:$scope.product.inclusive,
            inventoryalert:$scope.product.inventoryalert,
            purchaseinclusive:$scope.product.purchaseinclusive
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
        $http.post('/products/updateproduct1',{
          itemtype: $scope.product.itemtype,
          productname: $scope.product.productname,
          unit: $scope.product.unit,
          collection: $scope.selectedcollection.id,
          sku: $scope.product.sku,
          hsn: $scope.product.hsn,
          salesrate: $scope.salesrate,
          purchaserate: $scope.product.purchaserate,
          mrp: $scope.mrp,
          prices:$scope.prices,
          taxpreference: $scope.product.taxpreference,
          reason:$scope.product.reason,
          sgst:$scope.product.sgst,
          cgst:$scope.product.cgst,
          igst:$scope.product.igst,
          cess:$scope.product.cess,
          utgst:$scope.product.utgst,
          trackinventary: $scope.product.trackinventary,
          openingstock: $scope.product.openingstock,
          openingstockperrate: $scope.product.openingstockperrate,
          barcode: $scope.product.barcode,
          id:id,
          inventoryalert:$scope.product.inventoryalert,
          inclusive:$scope.product.inclusive,
          purchaseinclusive:$scope.product.purchaseinclusive
        }).then(function (res) {
          $state.go('itempage');
          $scope.success();
        }).catch(function (err) {
          $scope.error(err.data.err)
        })
      }
    };
  //   $scope.cal =function(){
  //     var sgst=isNaN($scope.product.sgst)?0:parseFloat($scope.product.sgst)
  //     var cgst=isNaN($scope.product.cgst)?0:parseFloat($scope.product.cgst)
  //     var igst=isNaN($scope.product.igst)?0:parseFloat($scope.product.igst)
  //     var cess=isNaN($scope.product.cess)?0:parseFloat($scope.product.cess)
  //     if($scope.salesrate){
  //       console.log($scope.product.salesrate)
  //     $scope.temp = (($scope.salesrate*(sgst+cgst+igst+cess))/100)
  //     console.log($scope.temp)
  //     $scope.salesrates =parseFloat($scope.salesrate)+parseFloat($scope.temp)
  //     console.log( $scope.salesrates )
  //   }else{$scope.salesrates = 0}
  // }
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
    $scope.getsku=function (id,collectionid) {
      $scope.count=$scope.count+1;
      if($scope.count==1){
        return
      }
      $http.post('/products/getsku',{id:collectionid}).then(function (res) {
        console.log(res);
        $scope.data=res.data.productno;
        if($scope.data==''){
          $scope.data=0;
        }
        $scope.productno=parseInt($scope.data)+1;
        $scope.product.sku=id+$scope.productno;

      })
    };
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
          $scope.product.barcode=id;
    }
    $scope.searchcollection=function (search) {
      return $http
        .post('/collection/searchcollection',{searchtext:search})
        .then(function (res) {
          return res.data.collections;

        }).catch(function (err) {
          return [];
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
    $scope.success = function() {
      $mdToast.show(
        $mdToast.simple()
          .textContent('Product Updated')
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };

  })
