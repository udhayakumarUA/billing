angular.module('posApp')
  .controller('bargenCtrl', function($scope,$http,$state) {

    $scope.selectedproduct1='';

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

    $scope.productchange=function(id){
      console.log(id)
      $http.post('/pos/productchange',{id:id}).then(function(res){
        console.log(res);
        $scope.bc.txt=res.data.products.barcode;
        $scope.bc.productname=res.data.products.productname;
        $scope.product=res.data.products;
      })
    }

    $scope.bc ={
      txt:'',
      inc: 2,
      price:'',
      pkd:'',
      best:'',
      labelnumber:'',
      company:'',
      productname:'',
      format: 'CODE128',
      lineColor: '#000000',
      width: 1,
      height: 20,
      displayValue: true,
      fontOptions: '',
      font: 'Arial Rounded MT',
      textAlign: 'center',
      textPosition: 'bottom',
      textMargin: 2,
      fontSize: 13,
      background: '#ffffff',
      margin: 20,
      marginTop: undefined,
      marginBottom: undefined,
      marginLeft: undefined,
      marginRight: undefined,
      valid: function (valid) {
      }
    }





    $scope.print=function(){
      $state.go("printbarcode",{myParam:JSON.stringify($scope.bc)});
    }
  }
);
