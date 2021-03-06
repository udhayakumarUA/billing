angular.module('posApp')
  .controller('invoiceCtrl', function($scope,$http,$filter, $mdDialog,verifyDelete,$timeout,$mdToast,$state,$stateParams,$rootScope,hotkeys) {
    console.log($rootScope.fromestate)
    $scope.invoicedate = new Date(Date.now());
    $scope.selectedcustomer='';
    $scope.salesorderstatus=false;
    $scope.orderid = ''
    //Fetching the invoice recent invoice id from the database

      $http.post('/invoice/getinvoiceid').then(function (res) {
        console.log(res)
        $scope.invoiceid = res.data.id
        $scope.oldnumber = res.data.id
      })

    //Check wether the ID Already exist in the database
    $scope.checkid = (id) => {
      if (id == undefined) {
        $scope.err = 'The ID field should not be empty'
        return
      }
      else if(id!=$scope.oldnumber)
        {

        return $http.post('/invoice/checkid', { id: id }).then(function (res) {
          console.log(res)
        }).catch((err) => {
          console.log(err)
          $scope.err = err.data.err
          return
        })
      }
    }
    //initialize products
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
          'sales':'',
          'singletax':'',
          'subtotal':'',
          'singlecgst':'',
          'singlesgst':'',
          'singleigst':'',
          'singlecess':''
        }];
        $scope.productsid=[];

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
    $http.post('/purchase/tax').then(function (res) {
      console.log(res)
      $scope.utgsts=res.data.utgsts;
      $scope.cesss=res.data.cesss;
      $scope.igsts=res.data.igsts;
      $scope.cgsts=res.data.cgsts;
      $scope.sgsts=res.data.sgsts;
    });
    //the request from the estimate page.
    if($stateParams.name=='estimate'){
      $http.post('/estimate/estimatebyid',{id:$stateParams.id}).then(function(res){
          console.log(res)
          $scope.salesorderstatus=true;
          $scope.products = res.data.result.estimate
          $scope.selectedcustomer=res.data.result.user
          $scope.selectedcustomer.plos = res.data.result.placeofsuply
          $scope.estimateid=res.data.result.estimateid
          $scope.estimate_main_id = $stateParams.id
          $scope.status = res.data.result.status
          $scope.invoicedate = new Date()
          $scope.selectedsp = res.data.result.salesperson
          // $scope.duedate = new Date(res.data.result.enddate)
          $scope.noteforcustomer = res.data.result.notes
          $scope.totalsub = res.data.result.subtotal
          $scope.totalcgst = res.data.result.cgstprice
          $scope.totalsgst = res.data.result.sgstprice
          $scope.totaligst = res.data.result.igstprice
          $scope.totalcess = res.data.result.cessprice
          $scope.maintotal = res.data.result.maintotal
     })
    }
    //this validation is to check the request is from the sales order page
    else if($stateParams.name=='salesorder'){
      $http.post('/salesorder/Salesorderbyid',{id:$stateParams.id}).then(function(res){
        console.log(res)
        //this is to change the status of the sales order to invoiced when the invoice is saved
        $scope.salesorderstatus=true;
        //This are the data from the sales order page to conver into invoice page
        $scope.products = res.data.result.salesorder
        $scope.selectedcustomer=res.data.result.user
        $scope.selectedcustomer.plos = res.data.result.placeofsuply
        $scope.salesorderid=res.data.result.salesorderid
        $scope.orderid = res.data.result.id
        $scope.status = res.data.result.status
        $scope.invoicedate = new  Date()
        $scope.orderdate = new Date(res.data.result.startdate)
        $scope.orderno=res.data.result.salesorderid;
        $scope.noteforcustomer = res.data.result.notes
        $scope.totalsub = res.data.result.subtotal
        $scope.totalcgst = res.data.result.cgstprice
        $scope.totalsgst = res.data.result.sgstprice
        $scope.totaligst = res.data.result.igstprice
        $scope.totalcess = res.data.result.cessprice
        $scope.maintotal = res.data.result.maintotal
        $scope.selectedsp = res.data.result.salesperson
        $scope.discount=parseFloat(res.data.result.discount);
        $scope.adjustment=res.data.result.adjustment;
        $scope.shipping = res.data.result.shipping;
   })
    }
    else if($stateParams.name=='invoice'){
      $http.post('/pos/singlepos',{posid:$stateParams.id,key:$rootScope.key}).then(function (res) {
        console.log(res);

        $scope.products=res.data.pos.products;

        for(i=0;i< $scope.products.length;i++){
          delete $scope.products[i].id
        }
        console.log($scope.products)
        $scope.selectedcustomer=res.data.pos.user;
        $scope.selectedcustomer.plos=res.data.pos.user.plos;
        $scope.invoicedate=new Date(res.data.pos.invoicedate);
        $scope.duedate=new Date(res.data.pos.duedate);
        $scope.noteforcustomer=res.data.pos.notes;
        $scope.totalsub=res.data.pos.totalsub;
        $scope.transportmode=res.data.pos.transportmode;
        $scope.maintotal=res.data.pos.maintotal;
        $scope.taxtotal=res.data.pos.taxtotal;
        $scope.totalcgst=res.data.pos.totalcgst;
        $scope.totalsgst=res.data.pos.totalsgst;
        $scope.totaligst=res.data.pos.totaligst;
        $scope.totalcess=res.data.pos.totalcess;
        $scope.paymentmode=res.data.pos.paymentmode;
        $scope.vehicleno=res.data.pos.vehicleno;
        $scope.discount=parseFloat(res.data.pos.discount);
        $scope.adjustment=res.data.pos.adjustment;
        $scope.singlepostax=res.data.pos.singlepostax;
        $scope.selectedsp=res.data.pos.salesperson;

        // $scope.orderno=res.data.pos.orderno;
      })

    }


    //search products
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

    $scope.search=function (searchtext) {
      return $http
        .post('/contact/searchcontacttype',{type:"Customer",searchtext:searchtext})
        .then(function (res) {
          console.log(res)
          return res.data.result;
        }).catch(function (err) {
          return [];
        })
    };
    $scope.searchsp=function (searchtext) {
      console.log(searchtext)
      return $http
        .post('salesperson/searchSalesperson',{searchtext:searchtext})
        .then(function (res) {
          console.log(res)
          return res.data.result;
        }).catch(function (err) {
          return [];
        })
    };
    //selected row
    // $scope.fectchdata=function (product,index) {
    //   if(!product){
    //     return;
    //   }

    //   $scope.productsid.push(product.id);
    //   $scope.products[index].quantity=1;
    //   $scope.products[index].productid=product.id;
    //   $scope.products[index].rate=parseFloat(product.salesrate);
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
      console.log(product)
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
            angular.element('#qty'+index)[0].select();
          });
          $scope.calculatetotal();
        }
        if(!product.prices)
        $scope.pushdata(product.salesrate);

        else if(product.prices.length>1){
          $mdDialog.show({
            controller: PriceController,
            templateUrl: 'templates/sales/dialogs/priceselect.html',
            parent: angular.element(document.body),
            locals:{prices:product.prices,index1:index},
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
          $scope.pushdata(product.prices[0].salesrate);
        }

      }
    };

  function PriceController($scope, $mdDialog,prices,index1) {
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
      $mdDialog.hide(prices[$scope.selectedPrice].salesrate);
    };

    $scope.cancel = function() {
      $mdDialog.hide();
    };
  }

    //click to rate
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


    //click to next row
    $scope.movetorow=function (e,index) {
      console.log(index)

      $scope.calculatetotal();
      if(e.which==13){
        if($scope.products[index].selectedItem==''){
          return
        }
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
          'sales':'',
          'singletax':'',
          'subtotal':'',
          'singlecgst':'',
          'singlesgst':'',
          'singleigst':'',
          'singlecess':''
        });
        $timeout(function () {
          angular.element('#autoCompleteId'+(index+1))[0].focus();
        })
      }

    };

    $scope.addNew=function () {
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
        'sales':'',
        'singletax':'',
        'subtotal':'',
        'singlecgst':'',
        'singlesgst':'',
        'singleigst':'',
        'singlecess':''
      });
    }

    //remove product
    $scope.remove=function (index) {
      if($scope.products.length==1){
        return
      }
      $scope.products.splice(index,1);
      $scope.calculatetotal();
    };


    //main calculations
    $scope.calculatetotal=function () {
      $scope.totalcgst=0;
      $scope.totalsgst=0;
      $scope.totaligst=0;
      $scope.totalcess=0;
      $scope.maintotal=0;
      $scope.taxtotal=0;
      $scope.totalsub=0;
      $scope.singlepostax=0;
      angular.forEach($scope.products, function(item,index){
        $scope.quantity=item.quantity;
        $scope.rate=item.rate;
        $scope.sgst=parseFloat(item.sgst);
        $scope.cgst=parseFloat(item.cgst);
        $scope.igst=parseFloat(item.igst);
        $scope.cess=parseFloat(item.cess);
        $scope.rowPrice = parseFloat($scope.rate * 1000) * $scope.quantity;
        $scope.singlecgst=parseFloat($scope.rate * $scope.quantity * $scope.cgst)/100;
        $scope.singlesgst=parseFloat($scope.rate * $scope.quantity *$scope.sgst)/100;
        $scope.singleigst=parseFloat($scope.rate * $scope.quantity * $scope.igst)/100;
        $scope.singlecess=parseFloat($scope.rate * $scope.quantity * $scope.cess)/100;
        $scope.totaltax=parseFloat($scope.singlecgst+$scope.singlesgst+$scope.singleigst+$scope.singlecess);
        $scope.singletax=parseFloat($scope.sgst+$scope.cgst+$scope.igst+$scope.cess);
        $scope.totalrowprice=parseFloat($scope.rate * $scope.quantity)+$scope.singlecgst+$scope.singlesgst+$scope.singleigst+$scope.singlecess;
        $scope.subtotal=parseFloat($scope.rate * $scope.quantity);
        $scope.totalsub=$scope.totalsub+$scope.subtotal;
        $scope.totalcgst=$scope.totalcgst+$scope.singlecgst;
        $scope.totalsgst=$scope.totalsgst+$scope.singlesgst;
        $scope.totaligst=$scope.totaligst+$scope.singleigst;
        $scope.totalcess=$scope.totalcess+$scope.singlecess;
        $scope.maintotal=$scope.maintotal+$scope.totalrowprice;
        $scope.taxtotal=$scope.taxtotal+$scope.totaltax;
        $scope.singlepostax=$scope.singlepostax+$scope.singletax;
        $scope.products[index].subtax=$scope.totaltax.toFixed(2);
        $scope.products[index].sales=$scope.subtotal.toFixed(2);
        $scope.products[index].singletax=$scope.singletax.toFixed(2);
        $scope.products[index].subtotal=$scope.totalrowprice.toFixed(2);
        $scope.products[index].cgst=$scope.cgst
        $scope.products[index].sgst=$scope.sgst
        $scope.products[index].igst=$scope.igst
        $scope.products[index].cess=$scope.cess
        $scope.products[index].singlecgst=$scope.singlecgst.toFixed(2);
        $scope.products[index].singlesgst=$scope.singlesgst.toFixed(2);
        $scope.products[index].singleigst=$scope.singleigst.toFixed(2);
        $scope.products[index].singlecess=$scope.singlecess.toFixed(2);

      });
      var dis=isNaN($scope.discount)?0:$scope.discount;
      var adjustment=isNaN($scope.adjustment)?0:$scope.adjustment;
      var shipping=isNaN($scope.shipping)?0:$scope.shipping;
      $scope.caldis=parseFloat(($scope.maintotal-(dis))+adjustment+shipping);
      $scope.maintotal=$scope.caldis.toFixed(2);
      $scope.taxtotal=$scope.taxtotal.toFixed(2);
      $scope.totalcgst=$scope.totalcgst.toFixed(2);
      $scope.totalsgst=$scope.totalsgst.toFixed(2);
      $scope.totaligst=$scope.totaligst.toFixed(2);
      $scope.totalcess=$scope.totalcess.toFixed(2);
      $scope.totalsub=$scope.totalsub.toFixed(2);

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
          type: 'Customer', firstname: $scope.firstname, lastname: $scope.lastname,
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

    // $http.post('/posconfig/getconfig').then(function(res){
    //   console.log(res)
    //   $scope.invoicenumber = res.data.invoicenumber;
    // })

    //credit bill
    $scope.addbill=function () {
       if($scope.selectedcustomer==null||$scope.selectedcustomer==''){
        $scope.success('Customer is required')
        return
      }
      console.log('d')
      if($scope.products[0].selectedItem==""){
        return
      }
      if($scope.err){
        $scope.success($scope.err) 
        return
      }
      var index=$scope.products.length-1;
      if($scope.products[index].selectedItem==''){
        $scope.products.splice(index,1);
      }

      $scope.date= new Date();
      var startdate=$filter('date')($scope.invoicedate, 'yyyy-MM-dd')
      var enddate=$filter('date')($scope.duedate, 'yyyy-MM-dd')
      if(startdate>enddate){
        $scope.success('Expiration date must be greater than invoice date') 
        return
       }
      console.log($scope.invoiceid);
      $http.post('/pos/saveinvoice',{
        statuschange :$scope.salesorderstatus,
        salesorderid:$scope.orderid,
        estimateid:$scope.estimate_main_id,
        invoicenumber:$scope.invoiceid,
        transportmode:$scope.transportmode,
        paymentmode:$scope.paymentmode,
        placeofsuply:$scope.selectedcustomer.plos,
        maintotal:$scope.maintotal,
        totalcgst:$scope.totalcgst,
        totalsgst:$scope.totalsgst,
        totaligst:$scope.totaligst,
        totalcess:$scope.totalcess,
        taxtotal:$scope.taxtotal,
        discount:isNaN($scope.discount)?0:$scope.discount,
        adjustment:$scope.adjustment,
        shipping:$scope.shipping,
        items:$scope.products.length,
        userid:$scope.selectedcustomer.id,
        singlepostax:$scope.singlepostax,
        username:$scope.selectedcustomer.firstname,
        product:$scope.products,
        totalsub:$scope.totalsub,
        clientid:localStorage.getItem('clientid'),
        vehicleno:$scope.vehicleno,
        noteforcustomer:$scope.noteforcustomer,
        terms:$scope.terms,
         invoicedate:$scope.invoicedate,
         date:startdate,
         duedate:$scope.duedate,
        orderdate:$scope.orderdate,
        orderno:$scope.orderno,
        salesperson:$scope.selectedsp?$scope.selectedsp.id:''
      }).then(function (res) {
          $scope.success('Bill Added');
          $state.go('invoicesingle',{posid:res.data.pos});
      })
      .catch(error=> {
        $scope.err = error.data.err
        $scope.success(error.data.err)
      })
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

    $scope.addSalesperson = function (ev) {
      $mdDialog.show({
        controller: AddSalesPersonController,
        templateUrl: 'templates/settings/dialogs/addsalesperson.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function (users) {
          $scope.getalldata()
        });
    };

    function AddSalesPersonController($scope, $mdDialog, $mdToast) {

      $scope.addsalesperson = function () {
        $http.post('/salesperson/addsalesperson', { name: $scope.name, email: $scope.email, phonenumber: $scope.phonenumber }).then(function (res) {
          $scope.success()
          $mdDialog.hide(res.data.result);
        }).catch(function (err) {
          $scope.error(err.data.err)
        })
      }
      $scope.success = function () {
        $mdToast.show(
          $mdToast.simple()
            .textContent('Added Successfully')
            .position('top right')
            .theme('success-toast')
            .hideDelay(1000)
        );
      };
      $scope.error = function (err) {
        $mdToast.show(
          $mdToast.simple()
            .textContent(err)
            .position('top=30px, right')
            .theme('error-toast')
            .hideDelay(3000)
        );
      };

      $scope.cancel = function () {
        $mdDialog.cancel();
      };

    }

  });
