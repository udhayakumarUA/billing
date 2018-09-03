angular.module('posApp')
  .controller('InvoiceeditCtrl', function($scope,$http,$mdDialog,$stateParams,$mdToast,$state,$rootScope,$filter,$timeout,hotkeys){
    $http.post('/pos/singlepos',{posid:$stateParams.posid,key:$rootScope.key}).then(function (res) {
      console.log(res);
      $scope.pos=res.data.pos;
      $scope.mainuser=res.data.mainuser;  
      $scope.vehicleno=$scope.pos.vehicleno;
      $scope.paymentmode=$scope.pos.paymentmode;
      $scope.transportmode=$scope.pos.transportmode;
      $scope.maintotal=$scope.pos.maintotal;
      $scope.taxtotal=$scope.pos.taxtotal;
      $scope.totalcgst=$scope.pos.totalcgst;
      $scope.totalsgst=$scope.pos.totalsgst;
      $scope.totaligst=$scope.pos.totaligst;
      $scope.totalcess=$scope.pos.totalcess;
      $scope.discount=parseFloat($scope.pos.discount);
      $scope.adjustment=$scope.pos.adjustment;
      $scope.shipping=$scope.pos.shipping;
      $scope.products=$scope.pos.products;
      $scope.selectedcustomer=$scope.pos.user;
      $scope.selectedcustomer.plos=$scope.pos.placeofsuply;
      $scope.totalsub=$scope.pos.totalsub;
      $scope.noteforcustomer=$scope.pos.notes;
      $scope.terms=$scope.pos.terms;
      $scope.invoicedate=new Date($scope.pos.invoicedate);
      $scope.duedate=$scope.pos.duedate;
      $scope.singlepostax=$scope.pos.singlepostax;
      $scope.orderdate=$scope.pos.orderdate;
      $scope.orderno=$scope.pos.orderno;
      $scope.selectedsp = $scope.pos.salesperson
      $scope.invoiceid = res.data.pos.autoinc
      $scope.orginalid = res.data.pos.autoinc
      $scope.checkid(invoiceid);
    })

    $scope.checkid = (id) => {
      if (id == undefined) {
        $scope.err = 'The ID field should not be empty'
        return
      }
      else if(id!=$scope.orginalid)
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
    $http.post('/purchase/tax').then(function (res) {
      console.log(res)
      $scope.utgsts=res.data.utgsts;
      $scope.cesss=res.data.cesss;
      $scope.igsts=res.data.igsts;
      $scope.cgsts=res.data.cgsts;
      $scope.sgsts=res.data.sgsts;
    });
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
    $scope.customerchange=function(){
      $scope.customercount++
      $scope.customercount>2?$scope.productsid = $scope.products.map(x=>x.productid):''     
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
    //se
    $scope.productsid=[];
    //selected row
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
        $scope.singletax=parseInt($scope.sgst+$scope.cgst+$scope.igst+$scope.cess);
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

    // $http.post('/posconfig/getconfig').then(function(res){
    //   $scope.terms = res.data.terms; 
    //   }) 
    
    //credit bill
    $scope.updatebill=function () {
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
      var startdate=$filter('date')($scope.invoicedate, 'yyyy-MM-dd');
      var enddate=$filter('date')($scope.duedate, 'yyyy-MM-dd');
      if(startdate>enddate){
        $scope.success('Expiration date must be greater than invoice date') 
        return
       }
      if($scope.products[index].selectedItem==''){
        $scope.products.splice(index,1);
      }
      if($scope.discount==null){
        $scope.discount=0;
      }
      $http.post('/pos/updateinvoice',{
        id:$scope.pos.id,
        invoicenumber:$scope.invoiceid,
        paymentmode:$scope.paymentmode,
        transportmode:$scope.transportmode,
        placeofsuply:$scope.selectedcustomer.plos,
        maintotal:$scope.maintotal,
        totalcgst:$scope.totalcgst,
        totalsgst:$scope.totalsgst,
        totaligst:$scope.totaligst,
        totalcess:$scope.totalcess,
        taxtotal:$scope.taxtotal,
        discount:$scope.discount,
        shipping:$scope.shipping,
        date:startdate,
        adjustment:$scope.adjustment,
        items:$scope.products.length,
        userid:$scope.selectedcustomer.id,
        username:$scope.selectedcustomer.firstname,
        product:$scope.products,
        totalsub:$scope.totalsub,
        singlepostax:$scope.singlepostax,
        vehicleno:$scope.vehicleno,
        invoicedate:$scope.invoicedate,
        noteforcustomer:$scope.noteforcustomer,
        terms:$scope.terms,
        duedate:$scope.duedate,
        orderdate:$scope.orderdate,
        orderno:$scope.orderno,
        salesperson:$scope.selectedsp?$scope.selectedsp.id:'',
        orginalid:$scope.orginalid

      }).then(function (res) {
        $scope.success('Bill Added');
        $state.go('pointofsale');
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
