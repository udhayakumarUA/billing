angular.module('posApp')
  .controller('purchaseorderCtrl', function($scope,$http,$mdDialog,verifyDelete,$timeout,$mdToast,$state,$filter,$stateParams,$location,hotkeys) {

    $scope.startdate = new Date()

    //getting taxes
    $http.post('/tax/gettaxes').then(function (res) {
      console.log(res)
      $scope.taxes = res.data.result
    });
    $scope.customerchange=function(){

      console.log($scope.productsid)
      if($scope.products[0].productid!==""&&$scope.selectedcustomer!==null){
        console.log('empty')
        if($scope.selectedcustomer.taxtype=='Inter State Tax Rate'){
          $http.post('/products/intraproducts',{productsid:$scope.productsid}).then(function(res){
            for(i=0;i<res.data.products.length;i++){
              $scope.products[i].igst=parseFloat(res.data.products[i].igst);
              $scope.products[i].cgst=0;
              $scope.products[i].sgst=0;
            }
            $scope.calculatetotal()
          })
        }
        else{
          $http.post('/products/intraproducts',{productsid:$scope.productsid}).then(function(res){
            for(i=0;i<res.data.products.length;i++){
              $scope.products[i].igst=0;
              $scope.products[i].cgst=parseFloat(res.data.products[i].cgst);
              $scope.products[i].sgst=parseFloat(res.data.products[i].sgst);
            }
            $scope.calculatetotal()
          })
        }
      }
    }
    //getting purchase order ID
     if($stateParams.key){
      $http.post('/purchaseorder/purchasebyid',{id:$stateParams.id}).then(function(res){
          console.log(res)
          $scope.products = res.data.result.purchase
          $scope.selectedcustomer=res.data.result.user
          $scope.selectedcustomer.sos = res.data.result.sourceofsupply
          $scope.purchaseorderid=res.data.result.purchaseorderid
          $scope.startdate = res.data.result.purchasedate
          $scope.notes = res.data.result.notes
          $scope.subtotal = res.data.result.subtotal
          $scope.cgstprice = res.data.result.cgstprice
          $scope.sgstprice = res.data.result.sgstprice
          $scope.igstprice = res.data.result.igstprice
          $scope.cessprice = res.data.result.cessprice
          $scope.maintotal = res.data.result.maintotal
     })

    }
    else{

    $http.post('/purchaseorder/getid').then(function(res){
      console.log(res)
        $scope.purchaseorders = res.data.result
        $scope.count = res.data.result.length
        var value = res.data.id.toString()
        $scope.purchaseorderid =res.data.id;
        $scope.porid = res.data.porid;
        $scope.totalpages=Math.ceil($scope.count/parseInt($scope.rows));
      })
  }
    $scope.addbill=function () {
      console.log($scope.selectedcustomer)
       if($scope.selectedcustomer==null||$scope.selectedcustomer==''){
        $scope.success('Customer is required')
        return
      }
      if($scope.products[0].selectedItem==""){
        return
      }
      var index=$scope.products.length-1;
      if($scope.products[index].selectedItem==''){
        $scope.products.splice(index,1);
      }
      $http.post('/purchaseorder/addpurchase',{
        user:$scope.selectedcustomer.id,
        username:$scope.selectedcustomer.firstname,
        sourceofsupply:$scope.selectedcustomer.sos,
        purchaseorderid:$scope.purchaseorderid,
        porid:$scope.porid,
        purchasedate:$scope.startdate,
        notes:$scope.notes,
        product:$scope.products,
        subtotal:$scope.subtotal,
        cgstprice:$scope.cgstprice,
        sgstprice:$scope.sgstprice,
        igstprice:$scope.igstprice,
        cessprice:$scope.cessprice,
        maintotal:$scope.maintotal,
        clientid:localStorage.getItem('clientid')
      }).then(function (res) {
        console.log(res)
        $scope.success('Bill Added');
        $location.path('/purchaseordersingle/'+res.data.result.id);
      })
    };
    $scope.updatepurchase=function () {
       if($scope.selectedcustomer==null||$scope.selectedcustomer==''){
        $scope.success('Customer is required')
        return
      }
      if($scope.products[0].selectedItem==""){
        return
      }
      var index=$scope.products.length-1;
      if($scope.products[index].selectedItem==''){
        $scope.products.splice(index,1);
      }
      $http.post('/purchaseorder/updatepurchase',{

        id:$stateParams.id,
        user:$scope.selectedcustomer.id,
        sourceofsupply:$scope.selectedcustomer.sos,
        purchaseorderid:$scope.purchaseorderid,
        porid:$scope.porid,
        purchasedate:$scope.startdate,
        notes:$scope.notes,
        product:$scope.products,
        subtotal:$scope.subtotal,
        cgstprice:$scope.cgstprice,
        sgstprice:$scope.sgstprice,
        igstprice:$scope.igstprice,
        cessprice:$scope.cessprice,
        maintotal:$scope.maintotal
      }).then(function (res) {
        console.log(res)
        $scope.success('purchaseorder updated');
       $location.path('/purchaseorderlist')
      })
    };
    $scope.addNew = function(){
      $scope.products.push({
          'selectedItem':'',
          'productid':'',
          'quantity':'',
          'rate':'',
          'sgst':'',
          'cgst':'',
          'igst':'',
          'cess':'',
          'subtax':'',
          'singletax':'',
          'subtotal':''
        });
    };
    $scope.products=[{
        'selectedItem':'',
        'productid':'',
        'quantity':'',
        'rate':'',
        'sgst':'',
        'cgst':'',
        'igst':'',
        'cess':'',
        'subtax':'',
        'singletax':'',
        'subtotal':''
      }];
    $scope.searchproducts=function (searchtext) {
      return $http
        .post('/pos/searchproducts',{searchtext:searchtext})
        .then(function (res) {
          console.log(res);
          return res.data.products;
        }).catch(function (err) {
          return [];
        })
    };
    $scope.productsid=[];

    // $scope.fectchdata=function (product,index) {
    //   if(!product){
    //     return;
    //   }

    //   $scope.products[index].quantity=1;
    //   $scope.products[index].productid=product.id;
    //   $scope.products[index].rate=parseFloat(product.purchaserate);
    //   $scope.productsid.push(product.id);
    //   if($scope.selectedcustomer.taxtype=='Inter State Tax Rate'){
    //     $scope.products[index].igst=parseFloat(product.igst);
    //     $scope.products[index].cgst=0;
    //     $scope.products[index].sgst=0;
    //   }
    //   else{
    //   $scope.products[index].sgst=parseFloat(product.sgst);
    //   $scope.products[index].cgst=parseFloat(product.cgst);
    //   $scope.products[index].igst=0;
    //   }
    //   $scope.products[index].cess=parseFloat(product.cess);
    //   $scope.products[index].unit=product.unit;
    //   $timeout(function () {
    //     angular.element('#qty'+index)[0].focus();
    //     angular.element('#qty'+index)[0].select()
    //   });
    //   $scope.calculatetotal();
    // };
    $scope.fectchdata=function (product,index) {
      if(!product){
        return;
      }
      else{
        $scope.pushdata=function(rate){
      $scope.products[index].quantity=1;
      $scope.products[index].productid=product.id;
      $scope.products[index].rate=parseFloat(rate);
      $scope.productsid.push(product.id);
      if($scope.selectedcustomer.taxtype=='Inter State Tax Rate'){
        $scope.products[index].igst=parseFloat(product.igst);
        $scope.products[index].cgst=0;
        $scope.products[index].sgst=0;
      }
      else{
      $scope.products[index].sgst=parseFloat(product.sgst);
      $scope.products[index].cgst=parseFloat(product.cgst);
      $scope.products[index].igst=0;
      }
      $scope.products[index].cess=parseFloat(product.cess);
      $scope.products[index].unit=product.unit;
      $timeout(function () {
        angular.element('#qty'+index)[0].focus();
        angular.element('#qty'+index)[0].select()
      });
      $scope.calculatetotal();
      }
      if(!product.prices)
      $scope.pushdata(product.salesrate);

      else if(product.prices.length>1){
          $mdDialog.show({
            controller: PriceController,
            templateUrl: 'templates/purchase/dialogs/priceselect.html',
            parent: angular.element(document.body),
            locals:{prices:product.prices},
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function(data) {
            if(data)
            $scope.pushdata(data);
            else{
              $timeout(function () {
                angular.element('#autoCompleteId'+index)[0].value=''
                angular.element('#autoCompleteId'+index)[0].focus();

              });
            }
          })
        }else{
          $scope.pushdata(product.prices[0].purchaserate);
        }

      }
    };

  function PriceController($scope, $mdDialog,prices) {
    $scope.pricerates = prices
    $scope.selectedPrice = 0

    hotkeys.bindTo($scope)
    .add({
      combo: 'left',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      description: 'price popup',
      callback: function() {
        $scope.changeprice(-1)
      }
    })
    .add({
      combo: 'right',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      description: 'price popup',
      callback: function() {
        $scope.changeprice(1)
      }
    })
    .add({
      combo: 'up',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      description: 'price popup',
      callback: function() {
        $scope.changeprice(-3)
      }
    })
    .add({
      combo: 'down',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      description: 'price popup',
      callback: function() {
        $scope.changeprice(3)
      }
    })
    .add({
      combo: 'enter',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      description: 'price popup',
      callback: function() {
        $scope.setprice(1)
      }
    })
    $scope.changeprice=function(val){
      if(($scope.selectedPrice+val)>=0 && ($scope.selectedPrice+val)<prices.length){
        $scope.selectedPrice=$scope.selectedPrice+val
        // (val==3)?$scope.selectedPrice+3:(val==1)?$scope.selectedPrice+1 : $scope.selectedPrice-1
      }else{
        console.log('zero')
      }
      console.log($scope.selectedPrice)
    }
    $scope.clickprice=function (index) {
      $scope.selectedPrice=index
  };
    $scope.setprice=function () {
        console.log($scope.selectedPrice)
      $mdDialog.hide(prices[$scope.selectedPrice].purchaserate);
    };

    $scope.cancel = function() {
      $mdDialog.hide();
    };
  }



    $scope.movetorate=function (e,index) {
      $scope.calculatetotal();
      console.log(e)
      if(e.which==13){
        $timeout(function () {
          angular.element('#rate'+index)[0].focus();
          angular.element('#rate'+index)[0].select()
        })
      }

    };
    $scope.movetorow=function (e,index) {
      $scope.calculatetotal();
      if(e.which==13){
        $scope.products.push({
          'selectedItem':'',
          'productid':'',
          'quantity':'',
          'rate':'',
          'sgst':'',
          'cgst':'',
          'igst':'',
          'cess':'',
          'subtax':'',
          'singletax':'',
          'subtotal':''
        });
        $timeout(function () {
          angular.element('#autoCompleteId'+(index+1))[0].focus();
        })
      }

    };
    $scope.removes=function (index) {
      if($scope.products.length==1){
        return
      }
      $scope.products.splice(index,1);
      $scope.calculatetotal();
      };

    $scope.calculatetotal=function () {
      $scope.maintotal=0;
      $scope.subtotal=0;
      $scope.taxtotal=0;

      $scope.cgstprice = 0; $scope.totalcgst = 0;
      $scope.sgstprice = 0; $scope.totalsgst = 0;
      $scope.igstprice = 0; $scope.totaligst = 0;
      $scope.cessprice = 0; $scope.totalcess = 0;

      angular.forEach($scope.products, function(item,index){
        $scope.quantity=item.quantity;
        $scope.rate=item.rate;
        $scope.sgst=parseFloat(item.sgst);
        $scope.cgst=parseFloat(item.cgst);
        $scope.igst=parseFloat(item.igst);
        $scope.cess=parseFloat(item.cess);
        $scope.totalcgst += parseFloat($scope.cgst);
        $scope.totalsgst += parseFloat($scope.sgst);
        $scope.totaligst += parseFloat($scope.igst);
        $scope.totalcess += parseFloat($scope.cess);
        $scope.rowPrice = parseFloat($scope.rate * 1000) * $scope.quantity;
        $scope.singlecgst=parseFloat($scope.rate * $scope.quantity * $scope.cgst)/100;
        $scope.singlesgst=parseFloat($scope.rate * $scope.quantity *$scope.sgst)/100;
        $scope.singleigst=parseFloat($scope.rate * $scope.quantity * $scope.igst)/100;
        $scope.singlecess=parseFloat($scope.rate * $scope.quantity * $scope.cess)/100;
        $scope.cgstprice += $scope.singlecgst;
        $scope.sgstprice += $scope.singlesgst;
        $scope.igstprice += $scope.singleigst;
        $scope.cessprice += $scope.singlecess;
        $scope.totaltax=parseFloat($scope.singlecgst+$scope.singlesgst+$scope.singleigst+$scope.singlecess);
        $scope.singletax=parseFloat($scope.sgst+$scope.cgst+$scope.igst+$scope.cess);
        $scope.totalrowprice=parseFloat($scope.rate * $scope.quantity)+$scope.singlecgst+$scope.singlesgst+$scope.singleigst+$scope.singlecess;
        $scope.maintotal=$scope.maintotal+$scope.totalrowprice;
        $scope.subtotal += parseFloat($scope.rate * $scope.quantity)
        $scope.taxtotal=$scope.taxtotal+$scope.totaltax;
        $scope.products[index].subtax=$scope.totaltax;
        $scope.products[index].singletax=$scope.singletax;
        $scope.products[index].subtotal=$scope.totalrowprice;

      });
      var dis=isNaN($scope.discount)?0:$scope.discount;
      $scope.maintotal=parseFloat($scope.maintotal-(dis));
    };

    $scope.success = function (text) {
      $mdToast.show(
        $mdToast.simple()
          .textContent(text)
          .position('top=30px, right')
          .theme('error-toast')
          .hideDelay(3000)
      );
    };
    $scope.cancelbill=function () {
      $state.reload();
    };

    //add contact
    $scope.addcontact = function(ev) {
      $mdDialog.show({
        controller: AddcontactController,
        templateUrl: 'templates/sales/dialogs/addcontact.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };
    function AddcontactController($scope, $mdDialog,$mdToast) {
      $scope.cancel = function () {
        $mdDialog.hide();
      };
      $scope.addcontact = function () {
        if ($scope.gsttype == 'Unregistered business' || $scope.gsttype == 'Consumer') {
          $scope.gstin = '';
        }
        $http.post('/contact/addcontact', {
          type: 'Vendor', firstname: $scope.firstname, lastname: $scope.lastname,
          mobilenumber: $scope.mobile, gsttype: $scope.gsttype, gstin: $scope.gstin,taxtype:$scope.taxrate.taxtype
        })
          .then(function (res) {
            console.log(res)
            $mdDialog.hide();
            $scope.success('User Added Successfully')
          })
        $scope.success = function (text) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(text)
              .position('top=30px, right')
              .theme('error-toast')
              .hideDelay(3000)
          );
        };
      }
    }

    //add item
    $scope.additem = function(ev) {
      console.log('add')
      $mdDialog.show({
        controller: AdditemController,
        templateUrl: 'templates/sales/dialogs/additem.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };


    function AdditemController($scope, $mdDialog,$mdToast) {
      $scope.taxpreference = 'Taxable';
      $scope.check=function(i){
        console.log(i)
      }
      $http.post('/products/getproductpre').then(function (res) {
        $scope.uoms = res.data.uoms;
        $scope.uoms1 = res.data.uoms1;
        $scope.utgsts = res.data.utgsts;
        $scope.cesss = res.data.cesss;
        $scope.igsts = res.data.igsts;
        $scope.cgsts = res.data.cgsts;
        $scope.sgsts = res.data.sgsts;
      });
      $scope.searchcollection = function (search) {
        return $http
          .post('/collection/searchcollection', {searchtext: search})
          .then(function (res) {
            return res.data.collections;

          }).catch(function (err) {
            return [];
          })
      }

      $scope.cal =function(){
        var sgst=isNaN($scope.sgst)?0:parseFloat($scope.sgst)
        var cgst=isNaN($scope.cgst)?0:parseFloat($scope.cgst)
        var igst=isNaN($scope.igst)?0:parseFloat($scope.igst)
        var cess=isNaN($scope.cess)?0:parseFloat($scope.cess)
        if($scope.salesrate){
          $scope.salesrates =$scope.salesrate+($scope.salesrate*(sgst+cgst+igst+cess))/100
        }else{$scope.salesrates = 0}
      }

      $scope.addproduct = function () {
        console.log($scope.inclusive);
        console.log($scope.purchaseinclusive);
        if($scope.taxpreference=='Non-Taxable'){
          $scope.sgst=0;
          $scope.cgst=0;
          $scope.igst=0;
          $scope.cess=0;
          $scope.utgst=0;
          $scope.inclusive=false;
          $scope.purchaseinclusive=false;
        }

        if($scope.trackinventary==false){
          $scope.openingstock='';
          $scope.openingstockperrate='';
          $scope.inventoryalert='';
          $scope.openingstock=0;
        }
        if($scope.inclusive==true){
          $scope.salesrate=parseFloat($scope.salesrate)
          $scope.cgst=parseFloat(isNaN($scope.cgst)?0:$scope.cgst)
          $scope.sgst=parseFloat(isNaN($scope.sgst)?0:$scope.sgst)
          $scope.igst=parseFloat(isNaN($scope.igst)?0:$scope.igst)
          $scope.cess=parseFloat(isNaN($scope.cess)?0:$scope.cess)
          $scope.totaltax=($scope.cgst+$scope.sgst+$scope.igst+$scope.cess);
          $scope.salesrate=parseFloat($scope.salesrate/ (($scope.totaltax/100) + 1 ))
        }
        if($scope.purchaseinclusive==true){
          $scope.purchaserate=parseFloat($scope.purchaserate)
          $scope.cgst=parseFloat(isNaN($scope.cgst)?0:$scope.cgst)
          $scope.sgst=parseFloat(isNaN($scope.sgst)?0:$scope.sgst)
          $scope.igst=parseFloat(isNaN($scope.igst)?0:$scope.igst)
          $scope.cess=parseFloat(isNaN($scope.cess)?0:$scope.cess)
          $scope.totaltax1=($scope.cgst+$scope.sgst+$scope.igst+$scope.cess);
          $scope.purchaserate=parseFloat($scope.purchaserate/ (($scope.totaltax1/100) + 1 ))
        }
        if(!$scope.trackinventary){
          $scope.openingstock=0
          $scope.openingstockperrate='';
          $scope.inventoryalert='';
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
          $mdDialog.hide();
          $scope.success('Product Added');
        }).catch(function (err) {
          $scope.error(err.data.err)
        })
        $scope.success = function (text) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(text)
              .position('top=30px, right')
              .theme('error-toast')
              .hideDelay(3000)
          );
        };

      };
      $scope.cancel = function () {
        $mdDialog.cancel();
      };
      $scope.getsku = function (id, collectionid) {
        if (!id) {
          return
        }
        $http.post('/products/getsku', {id: collectionid}).then(function (res) {
          console.log(res);
          $scope.data = res.data.productno;
          if ($scope.data == '') {
            $scope.data = 0;
          }
          $scope.productno = parseInt($scope.data) + 1;
          $scope.sku = id + $scope.productno;

        })
      };
    }

  $scope.search=function (searchtext) {
     return $http
         .post('/contact/searchcontacttype',{type:"Vendor",searchtext:searchtext})
         .then(function (res) {
          console.log(res)
           return res.data.result;
         }).catch(function (err) {
           return [];
         })
   }
  });
