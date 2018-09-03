let print_win;
angular.module('posApp')
  .controller('saledetails', function ($scope,$state, $http, $stateParams,$compile, $location,$filter, verifyDelete, $mdToast) {
    $scope.rows=20;
    $scope.count=0;
    $scope.currentpage=1;
    $scope.searchtext='';
    $scope.statustype = 'All';
    $scope.tableheading = ['Date', 'Bill No', 'Customer Name', 'Company Name', 'Status', 'Amount', 'Balance Due']
    $scope.getallApi = '/pos/getsaledetails';
    $scope.searchApi = '/pos/searchsaledetails';
    $scope.type = $stateParams.type
    $scope.date=''
    //the below function takes the arguent and the default html page content
    $scope.setdefaultdetails = function(heading,searchtitle,placeholder){
      $scope.mainHeading = heading;
      $scope.searchHeading = searchtitle;
      $scope.searchPlaceholder = placeholder;

    };

    (()=>{
      //check for the request and set the default details
        if($stateParams.type=="receivables"){
        $scope.setdefaultdetails('Bill List','Bill','Bill No or Customer Name');
        }
    else if($stateParams.type=="payables"){
      $scope.tableheading.splice(2,1,'Vendor Name')
      $scope.setdefaultdetails('Purchase Bills','Purchase','Bill No or Vendor Name');

    }
    else if($stateParams.type=="todaysale"){
      $scope.date=$filter('date')(new Date(), 'yyyy-MM-dd')
      $scope.tableheading.pop()
      $scope.setdefaultdetails('Bill List','Bill','Bill No or Customer Name'); 

    }
    else{
        $state.go('/')
    }
    
      $http.post($scope.getallApi,{status:$scope.statustype,type:$scope.type,skip: $scope.skip, limit: $scope.rows,date:$scope.date}).then((res)=>{
        $scope.details = res.data.result;
        console.log($scope.details.date)
        //  $scope.receivables = $scope.details.map(rec=>[
        //    rec.date,
        //    rec.posid,
        //     $compile(`<a ui-sref="invoicesingle({posid:${rec.posid}})">${rec.user.firstname}</a>`),
        //    rec.user.company,
        //    rec.status,
        //     $filter('number')(rec.maintotal,2),
        //    $filter('number')(rec.balance,2),
        //    rec
        //   ])
        //  console.log($scope.receivables)
          $scope.count = res.data.count
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
        })
      })()

    //  $scope.setcolor = (value)=>{
    //   if (value == "Draft") {
    //     return { color: "orange" }
    //   }
    //   else if (value == "Partially Paid") {
    //     return { color: "red" }
    //   }
    //  }
    
   
    $scope.more = function () {
        if ($scope.searchtext == '') {
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post($scope.getallApi, { status:$scope.statustype,type:$scope.type,skip: $scope.skip, limit: $scope.rows,date:$scope.date}).then(function (res) {
            console.log(res)
            $scope.details = res.data.result;
          })
        }
        else {
          $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
          $http.post($scope.searchApi, { status:$scope.statustype,type:$scope.type,searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows,date:$scope.date}).then(function (res) {
            $scope.details = res.data.result;
          })
        }
      };
     
  
       //search
       $scope.search = function (searchtext) {
        $scope.currentpage = 1;
        $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
        $http.post($scope.searchApi, { status:$scope.statustype,type:$scope.type,searchtext: searchtext, skip: $scope.skip, limit: $scope.rows,date:$scope.date}).then(function (res) {
          $scope.count = res.data.count;
          $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
          $scope.details = res.data.result;
        })
      };
  
        //limit
        $scope.changevalue = function () {
          if ($scope.searchtext == '') {
            $scope.currentpage = 1;
            $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
            $http.post($scope.getallApi, { type:$scope.type,status:$scope.statustype,skip: $scope.skip, limit: $scope.rows,date:$scope.date}).then(function (res) {
              $scope.details = res.data.result;
              $scope.count = res.data.count;
              $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
            });
          }
          else {
            $scope.currentpage = 1;
            $scope.skip = (($scope.currentpage - 1) * parseInt($scope.rows));
            $http.post($scope.searchApi, { type:$scope.type,status:$scope.statustype,searchtext: $scope.searchtext, skip: $scope.skip, limit: $scope.rows,date:$scope.date}).then(function (res) {
              $scope.details = res.data.result;
              $scope.count = res.data.count;
              $scope.totalpages = Math.ceil($scope.count / parseInt($scope.rows));
            });
          }
        }
  });