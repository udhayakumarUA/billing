angular.module('posApp')
  .controller('purchaseordereditCtrl', function($scope,$http,$mdDialog,verifyDelete,$timeout,$mdToast,$state,$filter) {

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

  });
