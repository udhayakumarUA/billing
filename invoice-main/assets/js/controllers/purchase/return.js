angular.module('posApp')
  .controller('returnCtrl', function($scope,$http,$mdDialog,verifyDelete,$timeout,$mdToast,$state,$filter,hotkeys) {

    $scope.billdate = new Date();
    $scope.duedate = new Date();
    var numberOfDaysToAdd = 30;
    $scope.duedate.setDate($scope.duedate.getDate() + numberOfDaysToAdd);

    $http.post('/return/tax').then(function (res) {
      console.log(res)
      $scope.utgsts=res.data.utgsts;
      $scope.cesss=res.data.cesss;
      $scope.igsts=res.data.igsts;
      $scope.cgsts=res.data.cgsts;
      $scope.sgsts=res.data.sgsts;
    });
    $http.post('/return/getsid').then(function (res) {
      console.log(res)
      $scope.returnid = res.data.id
      $scope.orginalid = res.data.id
    })
      //Check wether the ID Already exist in the database
      $scope.checkid = (id) => {
        if (id == undefined) {
          $scope.err = 'The ID field should not be empty'
          return
        }
        else if(id!=$scope.orginalid)
          {
  
          return $http.post('/return/checkid', { id: id }).then(function (res) {
            console.log(res)
          }).catch((err) => {
            console.log(err)
            $scope.err = err.data.err
            return
          })
        }
      }
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
      $scope.search=function (searchtext) {
        return $http
          .post('/contact/searchcontacttype',{type:"Vendor",searchtext:searchtext})
          .then(function (res) {
            return res.data.result;
          }).catch(function (err) {
            return [];
          });
      };

    $scope.searchproducts=function (searchtext) {
      return $http
        .post('/pos/searchproducts',{searchtext:searchtext})
        .then(function (res) {
          return res.data.products;
        }).catch(function (err) {
          return [];
        });
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
        'sales':'',
        'singletax':'',
        'subtotal':'',
        'singlecgst':'',
        'singlesgst':'',
        'singleigst':'',
        'singlecess':''
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
      'sales':'',
      'singletax':'',
      'subtotal':'',
      'singlecgst':'',
      'singlesgst':'',
      'singleigst':'',
      'singlecess':''
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
    //   $scope.productsid.push(product.id);
    //   $scope.products[index].quantity=1;
    //   $scope.products[index].productid=product.id;
    //   $scope.products[index].rate=parseFloat(product.purchaserate);
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
    $scope.fectchdata = function (product, index) {
      if (!product) {
        return;
      }
      else {
        $scope.pushdata = function (rate) {
          $scope.products[index].quantity = 1;
          $scope.products[index].productid = product.id;
          $scope.products[index].rate = parseFloat(rate);
          $scope.productsid.push(product.id);
          if ($scope.selectedcustomer.taxtype == 'Inter State Tax Rate') {
            $scope.products[index].igst = parseFloat(product.igst);
            $scope.products[index].cgst = 0;
            $scope.products[index].sgst = 0;
          }
          else {
            $scope.products[index].sgst = parseFloat(product.sgst);
            $scope.products[index].cgst = parseFloat(product.cgst);
            $scope.products[index].igst = 0;
          }
          $scope.products[index].cess = parseFloat(product.cess);
          $scope.products[index].unit = product.unit;
          $timeout(function () {
            angular.element('#qty' + index)[0].focus();
            angular.element('#qty' + index)[0].select()
          });
          $scope.calculatetotal();
        }
        if(!product.prices)
        $scope.pushdata(product.salesrate);
    
        else if (product.prices.length > 1) {
          $mdDialog.show({
            controller: PriceController,
            templateUrl: 'templates/purchase/dialogs/priceselect.html',
            parent: angular.element(document.body),
            locals: { prices: product.prices },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          }).then(function (data) {
            if(data)
            $scope.pushdata(data);
            else{
              $timeout(function () {
                angular.element('#autoCompleteId'+index)[0].value=''
                angular.element('#autoCompleteId'+index)[0].focus();

              });
            }
          })
        } else {
          $scope.pushdata(product.prices[0].purchaserate);
        }

      }
    };

    function PriceController($scope, $mdDialog, prices) {
      $scope.pricerates = prices
      $scope.selectedPrice = 0

      hotkeys.bindTo($scope)
        .add({
          combo: 'left',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          description: 'price popup',
          callback: function () {
            $scope.changeprice(-1)
          }
        })
        .add({
          combo: 'right',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          description: 'price popup',
          callback: function () {
            $scope.changeprice(1)
          }
        })
        .add({
          combo: 'up',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          description: 'price popup',
          callback: function () {
            $scope.changeprice(-3)
          }
        })
        .add({
          combo: 'down',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          description: 'price popup',
          callback: function () {
            $scope.changeprice(3)
          }
        })
        .add({
          combo: 'enter',
          allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
          description: 'price popup',
          callback: function () {
            $scope.setprice(1)
          }
        })
      $scope.changeprice = function (val) {
        if (($scope.selectedPrice + val) >= 0 && ($scope.selectedPrice + val) < prices.length) {
          $scope.selectedPrice = $scope.selectedPrice + val
          // (val==3)?$scope.selectedPrice+3:(val==1)?$scope.selectedPrice+1 : $scope.selectedPrice-1
        } else {
          console.log('zero')
        }
      }
      $scope.clickprice = function (index) {
        $scope.selectedPrice = index
      };
      $scope.setprice = function () {
        $mdDialog.hide(prices[$scope.selectedPrice].purchaserate);
      };

      $scope.cancel = function () {
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
         $scope.rate=isNaN(item.rate)?0:item.rate;
        $scope.products[index].rate=$scope.rate;
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
        $scope.saless =parseFloat($scope.rate * $scope.quantity)
        $scope.products[index].subtax=$scope.totaltax.toFixed(2);
        $scope.products[index].sales=$scope.saless.toFixed(2);
        $scope.products[index].singletax=$scope.singletax.toFixed(2);
        $scope.products[index].subtotal=$scope.totalrowprice.toFixed(2);
        $scope.products[index].singlecgst=$scope.singlecgst.toFixed(2);
        $scope.products[index].singlesgst=$scope.singlesgst.toFixed(2);
        $scope.products[index].singleigst=$scope.singleigst.toFixed(2);
        $scope.products[index].singlecess=$scope.singlecess.toFixed(2);

      });
      var dis=isNaN($scope.discount)?0:$scope.discount;
      $scope.maintotal=parseFloat($scope.maintotal+(dis));
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


    $scope.remove = function(){
      var newDataList=[];
      $scope.selectedAll = false;
      angular.forEach($scope.personalDetails, function(selected){
        if(!selected.selected){
          newDataList.push(selected);
        }
      });
      $scope.personalDetails = newDataList;
    };

    $scope.addbill=function () {
       if($scope.selectedcustomer==null||$scope.selectedcustomer==''){
        $scope.success('Customer is required')
        return
      }
      console.log('addbill');
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
      var billdate=$filter('date')($scope.billdate, 'yyyy-MM-dd')
      $http.post('/return/addbill',{
        returnid:$scope.returnid,
        status:'Draft',
        referenceid:$scope.referenceid,
        billid:$scope.billid,
        sourceofsuply:$scope.selectedcustomer.sos,
        returndate:billdate,
        balance:$scope.maintotal,
        maintotal:$scope.maintotal,
        totalcgst:$scope.cgstprice,
        totalsgst:$scope.sgstprice,
        totaligst:$scope.igstprice,
        totalcess:$scope.cessprice,
        taxtotal:$scope.taxtotal,
        items:$scope.products.length,
        reason:$scope.reason,
        userid:$scope.selectedcustomer.id,
        username:$scope.selectedcustomer.firstname,
        product:$scope.products,
        refid:$scope.refid,
        totalsub:$scope.subtotal
      }).then(function (res) {
        console.log(res)
        $state.go('singlereturn',{pid:res.data.refid});
        $scope.success('Return Bill Added');
      }).catch(error=> {
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
    $scope.cancelbill=function () {
      $state.reload();
    };
  });
