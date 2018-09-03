angular.module('posApp')
  .controller('posCtrl', function($scope,$mdDialog,$http,$filter,$timeout,$state,$mdToast,$document,hotkeys) {
    $scope.status ='';
    $scope.customFullscreen = false;
    $scope.selecteduser='';
    $scope.favouritecollection='';
    $scope.selectedcustomer='';
    $scope.selectedproduct1='';
    $scope.products=[];
    $scope.amounterror=false;
    $timeout(function () {
    angular.element('#autoCompleteId1').focus();})
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


    $http.post('/pos/getcustomer').then(function (res) {
      $scope.selectedcustomer=res.data.user;
    });

    $http.post('/pos/getproducts').then(function (res) {
      $scope.userproducts=res.data.userproducts;
      $scope.collections=res.data.collection;
      $scope.favourites=res.data.favourites;
    });

    //getuserproducts
    $scope.getuserproducts=function () {
      $http.post('/pos/getuserproducts').then(function (res) {
        $scope.userproducts=res.data.userproducts;
      })
    }

    //favourites
    $scope.getfavourites=function () {
      $http.post('/pos/getfavourites').then(function (res) {
        $scope.favourites=res.data.favourites;
      })
    }

    //search contact
    $scope.search=function (searchtext) {
      return $http
        .post('/pos/searchcontact',{searchtext:searchtext})
        .then(function (res) {
          return res.data.result;
        }).catch(function (err) {
          return [];
        })
    };

    //search all products
    $scope.searchuserproducts=function (searchtext) {
      $http.post('/pos/searcallproducts',{searchtext:searchtext,collection:$scope.usercollection}).then(function (res) {
        console.log(res);
        $scope.userproducts=res.data.products;
      })
    };

    //search favourite products
    $scope.searchfavourite=function (searchtext) {
      $http.post('/pos/searchfavourite',{searchtext:searchtext,collection:$scope.favouritecollection}).then(function (res) {
        console.log(res);
        $scope.favourites=res.data.favourites;
      })
    };

    //add to favourite
    $scope.addfavourite=function (id) {
      console.log(id)
      var index = $scope.userproducts.findIndex(x => x.id==id.id);
      $scope.userproducts[index].saved=true;
      $http.post('/pos/addfavourite',id).then(function (res) {
        console.log(res)
      })
    };

    //remove favourite
    $scope.removefavourite=function (id) {
      var index = $scope.userproducts.findIndex(x => x.id==id);
      $scope.userproducts[index].saved=false;
      $http.post('/pos/removefavourite',{id:id}).then(function (res) {
        console.log(res)
      })
    };
    $scope.removefavourite1=function (id) {
      var index = $scope.favourites.findIndex(x => x.productid==id);
      $scope.favourites.splice(index,1);
      $http.post('/pos/removefavourite',{id:id}).then(function (res) {
        console.log(res)
      })
    };


    //initialize products

    $scope.productsid=[];
    // $timeout(function () {
    //   angular.element('#autoCompleteId'+0)[0].focus();
    //   angular.element('#autoCompleteId'+0)[0].select()
    // });


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

    //selected row
    // $scope.fectchdata=function (product,index) {
    //  console.log('osearch')
    //   if(!product){
    //     return;
    //   }
    //   if(product.productid!=undefined){
    //     return;
    //   }

    //   $scope.products[index].quantity=1;
    //   $scope.products[index].productid=product.id;
    //   $scope.products[index].rate=parseFloat(product.salesrate);
    //   $scope.productsid.push(product.id);
    //   if($scope.selectedcustomer.taxtype=='Inter State Tax Rate'){
    //     $scope.products[index].igst=parseFloat(product.igst);
    //     $scope.products[index].cgst=0;
    //     $scope.products[index].sgst=0;
    //   }
    //   else{
    //     $scope.products[index].sgst=parseFloat(product.sgst);
    //     $scope.products[index].cgst=parseFloat(product.cgst);
    //     $scope.products[index].igst=0;
    //   }
    //   $scope.products[index].cess=parseFloat(product.cess);
    //   $scope.products[index].unit=product.unit;
    //   $timeout(function () {
    //     angular.element('#qty'+index)[0].focus();
    //     angular.element('#qty'+index)[0].select();
    //   });
    //   $scope.calculatetotal();


    // };
    $scope.fectchdata=function (product,index) {
      console.log(product)
      if(!product){
        return;
      }
      if(product.productid!=undefined){
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
            locals:{prices:product.prices},
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function(data) {
            $scope.pushdata(data);
            console.log('data')
          })
        }else{
          $scope.pushdata(product.prices[0].salesrate);
        }

      }
    };

    //barcode
    $scope.barcodeScanned = function(barcode) {
      console.log('barcode')
      console.log( $scope.products)
      $scope.products=$scope.products;
      var index=$scope.products.length-1;

        $http.post('/products/getsinglebarcode',{barcode:barcode}).then(function(res){
          console.log(res)
          if(!res.data.product){
            angular.element('#autoCompleteId1')[0].value=''
            return;
          }
          else{
            $scope.pushdata=function(rate){
          $scope.products.push({
            'selectedItem': res.data.product,
            'productid':res.data.product.id,
            'quantity': 1,
            'rate': parseFloat(rate),
            'sgst': $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?0:parseFloat(res.data.product.sgst),
            'cgst':  $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?0:parseFloat(res.data.product.cgst),
            'igst':  $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?parseFloat(res.data.product.igst):0,
            'cess': parseFloat(res.data.product.cess),
            'unit':res.data.product.unit,
            'subtax': '',
            'sales':'',
            'singletax':'',
            'subtotal': '',
            'singlecgst':'',
            'singlesgst':'',
            'singleigst':'',
            'singlecess':''
          });
          $scope.calculatetotal()
          var index=$scope.products.length-1;
          $timeout(function () {
            angular.element('#qty'+index)[0].focus();
            angular.element('#qty'+index)[0].select();
            angular.element('#autoCompleteId1')[0].value=''
            $scope.searchtexts=''
           console.log(angular.element('#autoCompleteId1'))
          })
        }
        if(!res.data.product.prices)
        $scope.pushdata(res.data.product.salesrate);
        else if(res.data.product.prices.length>1){
          $mdDialog.show({
            controller: PriceController,
            templateUrl: 'templates/sales/dialogs/priceselect.html',
            parent: angular.element(document.body),
            locals:{prices:res.data.product.prices},
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function(data) {
            $scope.pushdata(data);
          })
        }else{
          $scope.pushdata(res.data.product.prices[0].salesrate);
        }

      }

 })

      console.log('callback received barcode: ' + barcode);

  };

  $scope.enterkey=function (e) {
      if(e.which==13){
        if($scope.selectedproduct1==null||$scope.selectedproduct1==''){
          console.log('empty')
        }
        else{
          $scope.pushdata=function(rate){
            $scope.products.push({
              'selectedItem': $scope.selectedproduct1,
              'productid':$scope.selectedproduct1.id,
              'quantity': 1,
              'rate': parseFloat(rate),
              'sgst': $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?0:parseFloat($scope.selectedproduct1.sgst),
              'cgst':  $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?0:parseFloat($scope.selectedproduct1.cgst),
              'igst':  $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?parseFloat($scope.selectedproduct1.igst):0,
              'cess': parseFloat($scope.selectedproduct1.cess),
              'unit':$scope.selectedproduct1.unit,
              'subtax': '',
              'sales':'',
              'singletax':'',
              'subtotal': '',
              'singlecgst':'',
              'singlesgst':'',
              'singleigst':'',
              'singlecess':''
            });
            $scope.selectedproduct1=''
            $scope.calculatetotal()
            var index=$scope.products.length-1;
            console.log(index)

            $timeout(function () {
              angular.element('#qty'+index)[0].focus()
              angular.element('#qty'+index)[0].select()
             })
              $scope.searchtexts=''
             console.log(angular.element('#autoCompleteId1'))
            }
            if(!$scope.selectedproduct1.prices)
            $scope.pushdata($scope.selectedproduct1.salesrate);

          else if($scope.selectedproduct1.prices.length>1){
          $mdDialog.show({
            controller: PriceController,
            templateUrl: 'templates/sales/dialogs/priceselect.html',
            parent: angular.element(document.body),
            locals:{prices:$scope.selectedproduct1.prices},
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function(data) {
            console.log('data')
            console.log(data)
            $scope.pushdata(data);
            console.log('data')
          })
        }else{
          $scope.pushdata($scope.selectedproduct1.prices[0].salesrate);
        }

        }

      }
  }

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
      $mdDialog.hide(prices[$scope.selectedPrice].salesrate);
    };

    $scope.cancel = function() {
      $timeout(function () {
        angular.element('#autoCompleteId1')[0].value=''
        angular.element('#autoCompleteId1').focus();
        $scope.searchtexts=''
       console.log(angular.element('#autoCompleteId1'))
      })
      $mdDialog.cancel();
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
      // console.log(index)

      // $scope.calculatetotal();
      // if(e.which==13){
      //   if($scope.products[index].selectedItem==''){
      //     return
      //   }
      //   $scope.products.push({
      //     'selectedItem':'',
      //     'productid':'',
      //     'quantity':'',
      //     'rate':'',
      //     'sgst':'',
      //     'cgst':'',
      //     'igst':'',
      //     'cess':'',
      //     'subtax':'',
      //     'sales':'',
      //     'singletax':'',
      //     'subtotal':'',
      //     'singlecgst':'',
      //     'singlesgst':'',
      //     'singleigst':'',
      //     'singlecess':''
      //   });
        $timeout(function () {
          angular.element('#autoCompleteId1').focus();
        })
      // }

    };


    $scope.clickadd=function (product) {
      console.log(product)
      // var index1=$scope.products.length-1;
      // if($scope.products[index1].selectedItem==''){
      //   $scope.productsid.push(product.id);
      //   $scope.products[index1].selectedItem=product;
      //   $scope.products[index1].productid=product.id;
      //   $scope.products[index1].quantity=1;
      //   $scope.products[index1].rate=parseFloat(product.salesrate);
      //   if($scope.selectedcustomer.taxtype=='Inter State Tax Rate'){
      //     $scope.products[index1].igst=parseFloat(product.igst);
      //     $scope.products[index1].cgst=0;
      //     $scope.products[index1].sgst=0;
      //   }
      //   else{
      //     $scope.products[index1].sgst=parseFloat(product.sgst);
      //     $scope.products[index1].cgst=parseFloat(product.cgst);
      //     $scope.products[index1].igst=0;
      //   }
      //   $scope.products[index1].cess=parseFloat(product.cess);
      //   $scope.products[index1].unit=product.unit;
      //   $scope.products[index1].subtax='';
      //   $scope.products[index1].subtotal='';
      // }
      // else {
        $scope.productsid.push(product.id)
        $scope.pushdata=function(rate){
        $scope.products.push({
          'selectedItem': product,
          'productid':product.id,
          'quantity': 1,
          'rate': parseFloat(rate),
          'sgst': $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?0:parseFloat(product.sgst),
          'cgst':  $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?0:parseFloat(product.cgst),
          'igst':  $scope.selectedcustomer.taxtype=='Inter State Tax Rate'?parseFloat(product.igst):0,
          'cess': parseFloat(product.cess),
          'unit':product.unit,
          'subtax': '',
          'sales':'',
          'singletax':'',
          'subtotal': '',
          'singlecgst':'',
          'singlesgst':'',
          'singleigst':'',
          'singlecess':''
        });
        var index=$scope.products.length-1;
        $timeout(function () {
          angular.element('#qty'+index)[0].focus();
          angular.element('#qty'+index)[0].select()
        });
      // }
      $scope.calculatetotal();
      }
      if(!product.prices)
      $scope.pushdata(product.salesrate);

    else if(product.prices.length>1){
    $mdDialog.show({
      controller: PriceController,
      templateUrl: 'templates/sales/dialogs/priceselect.html',
      parent: angular.element(document.body),
      locals:{prices:product.prices},
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    }).then(function(data) {
      $scope.pushdata(data);
      console.log('data')
    })
    }else{
      $scope.pushdata(product.prices[0].salesrate);
    }
  };

    //click to add product
    $scope.clickaddfavourite=function (product,id) {
      console.log(product)
      var index1=$scope.products.length-1;
      console.log(index1)
      // if($scope.products[index1].selectedItem==''){
      //   $scope.products[index1].selectedItem=product;
      //   $scope.products[index1].productid=product.productid;
      //   $scope.products[index1].quantity=1;
      //   $scope.products[index1].rate=parseFloat(product.salesrate);
      //   $scope.products[index1].sgst=parseFloat(product.sgst);
      //   $scope.products[index1].cgst=parseFloat(product.cgst);
      //   $scope.products[index1].igst=parseFloat(product.igst);
      //   $scope.products[index1].cess=parseFloat(product.cess);
      //   $scope.products[index1].unit=product.unit;
      //   $scope.products[index1].subtax='';
      //   $scope.products[index1].subtotal='';
      //
      // }
      // else {
        $scope.pushdata=function(rate){
        $scope.products.push({
          'selectedItem': product,
          'productid':product.productid,
          'quantity': 1,
          'rate': parseFloat(rate),
          'sgst': parseFloat(product.sgst),
          'cgst': parseFloat(product.cgst),
          'igst': parseFloat(product.igst),
          'cess': parseFloat(product.cess),
          'unit':product.unit,
          'subtax': '',
          'sales':'',
          'singletax':'',
          'subtotal': '',
          'singlecgst':'',
          'singlesgst':'',
          'singleigst':'',
          'singlecess':''
        });
        var index=$scope.products.length-1;
        $timeout(function () {
          angular.element('#qty'+index)[0].focus();
          angular.element('#qty'+index)[0].select()
        });
      // }
      $scope.calculatetotal();
    }
    if(!product.prices)
    $scope.pushdata(product.salesrate);

  else if(product.prices.length>1){
  $mdDialog.show({
    controller: PriceController,
    templateUrl: 'templates/sales/dialogs/priceselect.html',
    parent: angular.element(document.body),
    locals:{prices:product.prices},
    clickOutsideToClose:true,
    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
  }).then(function(data) {
    $scope.pushdata(data);
    console.log('data')
  })
  }else{
    $scope.pushdata(product.prices[0].salesrate);
  }
    };


    //remove product
    $scope.remove=function (index) {

      $scope.products.splice(index,1);
      $scope.calculatetotal();
    };



    //category filter
    $scope.categoryswitch=function (text) {
      $http.post('/pos/categoryfilter',{collection:text}).then(function (res) {

        $scope.userproducts=res.data.products;
      })
    };
    $scope.categoryswitch1=function (text) {
      $http.post('/pos/categoryfilter1',{collection:text}).then(function (res) {
        $scope.favourites=res.data.favourites;
      })
    };



    //main calculations
    $scope.calculatetotal=function () {
      console.log('s')
      $scope.totalcgst=0;
      $scope.totalsgst=0;
      $scope.totaligst=0;
      $scope.totalcess=0;
      $scope.maintotal=0;
      $scope.taxtotal=0;
      $scope.totalsub=0;
      $scope.singlepostax=0;
      $scope.totalquantity=0;
      angular.forEach($scope.products, function(item,index){
        $scope.quantity=item.quantity;
        $scope.rate=item.rate;
        $scope.sgst=parseFloat(item.sgst);
        $scope.cgst=parseFloat(item.cgst);
        $scope.igst=parseFloat(item.igst);
        $scope.cess=parseFloat(item.cess);
        $scope.items=parseInt(item.quantity);
        $scope.rowPrice = parseFloat($scope.rate * 1000) * $scope.quantity;
        $scope.singlecgst=parseFloat($scope.rate * $scope.quantity * $scope.cgst)/100;
        $scope.singlesgst=parseFloat($scope.rate * $scope.quantity *$scope.sgst)/100;
        $scope.singleigst=parseFloat($scope.rate * $scope.quantity * $scope.igst)/100;
        $scope.singlecess=parseFloat($scope.rate * $scope.quantity * $scope.cess)/100;
        $scope.totaltax=parseFloat($scope.singlecgst+$scope.singlesgst+$scope.singleigst+$scope.singlecess);
        $scope.singletax=parseFloat($scope.sgst+$scope.cgst+$scope.igst+$scope.cess);
        console.log($scope.singletax)
        $scope.totalrowprice=parseFloat($scope.rate * $scope.quantity)+$scope.singlecgst+$scope.singlesgst+$scope.singleigst+$scope.singlecess;
        $scope.subtotal=parseFloat($scope.rate * $scope.quantity);
        $scope.saless =parseFloat($scope.rate * $scope.quantity);
        $scope.totalsub=$scope.totalsub+$scope.subtotal;
        $scope.totalcgst=$scope.totalcgst+$scope.singlecgst;
        $scope.totalsgst=$scope.totalsgst+$scope.singlesgst;
        $scope.totaligst=$scope.totaligst+$scope.singleigst;
        $scope.totalcess=$scope.totalcess+$scope.singlecess;
        $scope.maintotal=$scope.maintotal+$scope.totalrowprice;
        $scope.taxtotal=$scope.taxtotal+$scope.totaltax;
        $scope.singlepostax=$scope.singlepostax+$scope.singletax;
        $scope.totalquantity=$scope.totalquantity+$scope.items;
        $scope.products[index].subtax=$scope.totaltax.toFixed(2);
        $scope.products[index].sales = $scope.saless.toFixed(2);
        $scope.products[index].singletax=parseFloat($scope.singletax.toFixed(2));
        console.log($scope.products[index].singletax)
        $scope.products[index].subtotal=$scope.totalrowprice.toFixed(2);
        $scope.products[index].singlecgst=$scope.singlecgst.toFixed(2);
        $scope.products[index].singlesgst=$scope.singlesgst.toFixed(2);
        $scope.products[index].singleigst=$scope.singleigst.toFixed(2);
        $scope.products[index].singlecess=$scope.singlecess.toFixed(2);

      });
      var dis=isNaN($scope.discount)?0:$scope.discount;
      $scope.caldis=parseFloat($scope.maintotal-(dis));
      $scope.maintotal=Math.round($scope.caldis);
      // $scope.maintotal=$scope.caldis.toFixed(2);
      $scope.taxtotal=$scope.taxtotal.toFixed(2);
      $scope.totalcgst=$scope.totalcgst.toFixed(2);
      $scope.totalsgst=$scope.totalsgst.toFixed(2);
      $scope.totaligst=$scope.totaligst.toFixed(2);
      $scope.totalcess=$scope.totalcess.toFixed(2);
      $scope.totalsub=$scope.totalsub.toFixed(2);
    };



    //credit bill
    var creditdup=0;
    $scope.creditbill=function () {
      if($scope.selectedcustomer==null||$scope.selectedcustomer==''){
        $scope.success('Customer is required')
        return
      }
      if($scope.products[0].selectedItem==""){
        return
      }
      if(creditdup==1){
        return
      }
      creditdup=1

      var index=$scope.products.length-1;
      if($scope.products[index].selectedItem==''){
        $scope.products.splice(index,1);
      }
      $scope.date= new Date();
      var startdate=$filter('date')($scope.date, 'yyyy-MM-dd')
      console.log($scope.products)
      $http.post('/pos/savebill',{
        totalpaying:0,
        balance:$scope.maintotal,
        maintotal:$scope.maintotal,
        totalcgst:$scope.totalcgst,
        totalsgst:$scope.totalsgst,
        totaligst:$scope.totaligst,
        totalcess:$scope.totalcess,
        date:startdate,
        singlepostax:$scope.singlepostax,
        taxtotal:$scope.taxtotal,
        discount:$scope.discount,
        items:$scope.products.length,
        userid:$scope.selectedcustomer.id,
        username:$scope.selectedcustomer.firstname,
        product:$scope.products,
        groupid:$scope.products,
        totalsub:$scope.totalsub,
        totalquantity:$scope.totalquantity,
        clientid:localStorage.getItem('clientid')
      }).then(function (res) {
        creditdup=0;
        $scope.success('Bill Added');
        $scope.maintotal='';
        $scope.taxtotal='';
        $scope.discount='';
        $scope.products=[];
        $timeout(function () {
          angular.element('#autoCompleteId1').focus();
        });
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

    //cancel
    $scope.cancelbill=function () {
      $scope.maintotal='';
      $scope.taxtotal='';
      $scope.discount='';
      $scope.products=[];
      $timeout(function () {
        angular.element('#autoCompleteId1').focus();
      });
    };


    var opened=false;
    //payment
    $scope.payment = function(ev) {
      if($scope.selectedcustomer==null||$scope.selectedcustomer==''){
        $scope.success('Customer is required')
        return
      }
      if(opened==true){
        return
      }
      if($scope.products[0].selectedItem==''){
        return
      }
      var index=$scope.products.length-1;
      if($scope.products[index].selectedItem==''){
        $scope.products.splice(index,1);
      }
      $mdDialog.show({
        controller: PaymentController,
        templateUrl: 'templates/sales/dialogs/payment.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        locals:{product:$scope.products,
          maintotal:$scope.maintotal,
          taxtotal:$scope.taxtotal,
          discount:$scope.discount,
          user:$scope.selectedcustomer,
          totalcgst:$scope.totalcgst,
          singlepostax:$scope.singlepostax,
          totalsgst:$scope.totalsgst,
          totaligst:$scope.totaligst,
          totalcess:$scope.totalcess,
          totalsub:$scope.totalsub,
          totalquantity:$scope.totalquantity
        },
        clickOutsideToClose:false,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function(answer) {
          $scope.maintotal='';
          $scope.taxtotal='';
          $scope.discount='';
          $scope.products=[];
          $timeout(function () {
            angular.element('#autoCompleteId1').focus();
          });
        });
    };

    function PaymentController($scope, $mdDialog,$mdToast,$timeout,product,maintotal,taxtotal,discount,user,totalcgst,totalsgst,totaligst,totalcess,totalsub,singlepostax,$timeout,totalquantity) {
      opened=true
      $scope.amounterror=false;
      $scope.max=parseFloat(maintotal);
      $scope.maintotal = maintotal;
      $scope.totalpaying =parseFloat( maintotal);
      $scope.items = product.length;
      $scope.balance = parseFloat($scope.totalpaying - maintotal)
      $scope.balance1 = $scope.balance.toFixed(2);
      $scope.finalpayment = function () {
        $scope.amounterror=false;
        $scope.balance = parseFloat($scope.totalpaying - maintotal)
        $scope.balance1 = $scope.balance.toFixed(2);
      };
      $scope.cancel=function () {
        $mdDialog.cancel();
        opened=false
      }
      $timeout(function () {
        angular.element('#tenderedamount').focus();
        angular.element('#tenderedamount').select()
      },600);
      var count=0;
      $scope.defaulturl='';
      var print_win;
      $scope.savebill = function () {
        if(count==1){
          return
        }
        count=1;
        if(product[0].selectedItem==""){
          return
        }
        if($scope.totalpaying<maintotal){
          $scope.amounterror=true;
          $scope.success('Amount must be greater or equal to bill amount')
          return;
        }
        $scope.status = '';
        $scope.date= new Date();
        var startdate=$filter('date')($scope.date, 'yyyy-MM-dd')
        $http.post('/pos/savebill', {
          status: $scope.status,
          maintotal: maintotal,
          taxtotal: taxtotal,
          discount: discount,
          items: $scope.items,
          balance: $scope.balance1,
          tenderedamount: $scope.totalpaying,
          totalpaying:maintotal,
          userid: user.id,
          username: user.firstname,
          date:startdate,
          product: product,
          paymentmode: $scope.paymentmode,
          totalcgst: totalcgst,
          totalsgst: totalsgst,
          totaligst: totaligst,
          totalcess: totalcess,
          totalsub: totalsub,
          singlepostax:singlepostax,
          totalquantity:totalquantity,
          clientid:localStorage.getItem('clientid')
        }).then(function (res) {
          count=1;
          $scope.posprint=res.data.pos;
          $scope.default=res.data.postem;
          opened=false;

          $mdDialog.hide();
          opened=false
          $scope.success('Bill Generated Successfully');

        });

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
      hotkeys.bindTo($scope)
        .add({
          combo: 'f6',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          description: 'payment popup',
          callback: function() {
            $scope.savebill()
          }
        })
        .add({
          combo: 'f7',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          description: 'payment popup',
          callback: function() {
            $mdDialog.cancel();
            opened=false
          }
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

//hold bill
    var holddup=0;
    $scope.holdbill=function () {
      if($scope.selectedcustomer==null||$scope.selectedcustomer==''){
        $scope.success('Customer is required')
        return
      }
      if($scope.products[0].selectedItem==''){
        return
      }
      if(holddup==1){
        return
      }
      holddup=1;
      var index=$scope.products.length-1;
      if($scope.products[index].selectedItem==''){
        $scope.products.splice(index,1);
      }
      $http.post('/hold/addhold',{
        products:$scope.products,
        maintotal:$scope.maintotal,
        singlepostax:$scope.singlepostax,
        totalquantity:$scope.totalquantity,
        taxtotal:$scope.taxtotal,
        discount:$scope.discount,
        items:$scope.products.length,
        user:$scope.selectedcustomer
      }).then(function (res) {
        holddup=0;
        console.log(res);
        $scope.success('Holded')
        $scope.maintotal='';
        $scope.taxtotal='';
        $scope.discount='';
        $scope.products=[];
        $timeout(function () {
          angular.element('#autoCompleteId1').focus();
        });
      })
    }


    //restore hold
    var resdup=0;
    $scope.restorehold = function(ev) {
      if(resdup==1){

        return
      }
      resdup=1
      $mdDialog.show({
        controller: HoldController,
        templateUrl: 'templates/sales/dialogs/restorehold.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function(data) {
          resdup=0
          $scope.products = data.products;
          $scope.maintotal=data.maintotal;
          $scope.totalquantity=data.totalquantity;
          $scope.singlepostax=data.singlepostax,
            $scope.taxtotal=data.taxtotal;
          $scope.discount=data.discount;
          $scope.items=data.items;
          $scope.selectedcustomer=data.user;
        });
      resdup=0
    };

    function HoldController($scope, $mdDialog) {
      $http.post('/hold/getholdbills').then(function (res) {
        $scope.holds=res.data.holds;
      });
      $scope.restore=function (id) {
        $http.post('/hold/restoreholdbills',{id:id}).then(function (res) {
          $mdDialog.hide(res.data.holds);
        })
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    }

    hotkeys.bindTo($scope)
      .add({
        combo: 'f1',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        description: 'payment popup',
        callback: function() {
          $scope.payment()
        }
      })
      .add({
        combo: 'f2',
        description: 'creditbill',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $scope.creditbill()
        }
      })
      .add({
        combo: 'f3',
        description: 'cancel bill',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $scope.cancelbill()
        }
      })
      .add({
        combo: 'f4',
        description: 'hold bill',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $scope.holdbill()
        }
      })
      .add({
        combo: 'f5',
        description: 'restore hold',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
        callback: function() {
          $scope.restorehold()
        }
      })

  })
