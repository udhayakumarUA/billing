angular.module('posApp')
  .controller('AddscontactCtrl', function ($scope, $http,$state, $location, $mdDialog, verifyDelete) {
    $scope.type = { var: 'Customer' };
    $scope.taxrate={taxtype:'Intra State Tax Rate'}
    $scope.status = '';
    $scope.gsttype = '';
    $scope.rows = 20;
    $scope.count = 0;
    $scope.contacttype = 'All'
    $scope.currentpage = 1;
    $scope.contact = [];
    $scope.searchtext = '';
    $scope.customFullscreen = false;
    console.log('sdsdds' + $scope.contacttype)
    $scope.addcontact = function () {

      $http.post('/contact/addcontact', 
      {
        type: $scope.type.var,
         taxtype:$scope.taxrate.taxtype,
         salutation: $scope.salutation,
         firstname: $scope.firstname,
         lastname: $scope.lastname,
         company: $scope.company,
         email: $scope.email,
         phonenumber: $scope.phone,
         mobilenumber: $scope.mobile,
         address: $scope.address,
         gsttype: $scope.gsttype,
         gstin: $scope.gstin,
         pos: $scope.pos,
         sos: $scope.sos,
         statecode: $scope.statecode,
         pannumber:$scope.pannumber
      })
        .then(function (res) {
          console.log(res)
          $location.path('/contactpage');
        })
    }
    $scope.exportAction = function (option) {
      switch (option) {
        case 'pdf': $scope.$broadcast('export-pdf', {});
          break;
        case 'excel': $scope.$broadcast('export-excel', {});
          break;
        case 'doc': $scope.$broadcast('export-doc', {});
          break;
        case 'csv': $scope.$broadcast('export-csv', {});
          break;
        default: console.log('no event caught');
      }
    }

    $http.post('/contact/getcontact').then(function (res) {
      console.log(res)
      $scope.count = res.data.count;
      $scope.contact = res.data.result;
      $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
    });

    //getmore
    $scope.more = function () {
      if ($scope.searchtext == '') {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/contact/getmorecontact', { skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.contact = res.data.result;
        })
      }
      else {
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/contact/searchgetmore', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.contact = res.data.result;
        })
      }
    };

    //search
    $scope.search = function (searchtext) {
      $scope.currentpage = 1;
      $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
      $http.post('/contact/searchcontact', { searchtext: searchtext, skip: $scope.skip, limit: $scope.rows }).then(function (res) {
        $scope.count = res.data.count;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.contact = res.data.result;
      })
    }
    //limit
    $scope.changevalue = function () {
      if ($scope.searchtext == '') {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/contact/getmorecontact', { skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.contact = res.data.result;
        });
      }
      else {
        $scope.currentpage = 1;
        $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post('/contact/searchgetmore', { searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows }).then(function (res) {
          $scope.contact = res.data.result;
        });
      }
    }

    // $http.post('/contact/getcontact',{row:$scope.rows}).then(function(res){
    //       console.log(res)
    //       console.log($scope.rows)
    //       $scope.contacts = res.data.result
    //       $scope.count = res.data.count
    //       $scope.skip += $scope.rows
    //     if ($scope.count <= $scope.rows){
    //       $scope.noMore = true;
    //     }
    //       else{$scope.noMore = false;}
    //   })
    // $scope.skip = 0;
    //   $scope.getrows =function(){
    //     $http.post('/contact/getcontact',{row:$scope.rows}).then(function(res){
    //       console.log(res)
    //       console.log($scope.rows)
    //       $scope.contacts = res.data.result
    //       $scope.count = res.data.count
    //       console.log($scope.skip)
    //       $scope.skip += parseInt($scope.rows)
    //       console.log($scope.skip)
    //     if ($scope.count <= parseInt($scope.rows) ){
    //       $scope.noMore = true;
    //     }
    //       else{$scope.noMore = false;}
    //     })
    //   }
    // $scope.more=function() {
    //   if (!$scope.searchtext) {
    //     $http({
    //       url: '/contact/getmorecontact',
    //       method: "POST",
    //       params: {row:$scope.rows,skip: $scope.skip}
    //     }).then(function (res) {
    //       $scope.count = res.data.count;
    //       console.log(res);
    //       for (var i = 0; i < res.data.result.length; i++) {
    //         $scope.contacts.push(res.data.result[i])
    //       }
    //       $scope.skip +=$scope.rows
    //       if ($scope.skip >= $scope.count) {
    //         $scope.noMore = true;
    //       }
    //     });
    //   }
    //   else {
    //     $http({
    //       url: '/contact/searchgetmore',
    //       method: "POST",
    //       params: {row:$scope.rows,skip: $scope.skip, searchtext: $scope.searchtext}
    //     }).then(function (res) {
    //       $scope.count = res.data.count;
    //       for (var i = 0; i <res.data.result.length; i++) {
    //         $scope.contacts.push(res.data.result[i])
    //       }
    //       $scope.skip = $scope.skip + $scope.rows;
    //       if ($scope.skip >= $scope.count) {
    //         $scope.noMore = true;
    //       }
    //     });
    //   }
    // }
    // $scope.search=function (search) {
    //       $scope.skip=0;
    //       $http.post('/contact/searchcontact',{searchtext:search,row:$scope.row}).then(function (res) {
    //       console.log(res);
    //       $scope.contacts=res.data.result;
    //       $scope.count=res.data.count
    //        $scope.skip += parseInt($scope.rows)
    //       console.log($scope.skip)
    //     if ($scope.count <= parseInt($scope.rows) ){
    //       $scope.noMore = true;
    //     }
    //       else{$scope.noMore = false;}
    //     })
    // }

  })
