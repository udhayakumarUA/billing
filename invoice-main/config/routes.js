/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  'GET /*': {controller:'PagesController',action:'index', skipAssets: true},

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  'POST /user/createuser':'UserController.createuser',
  'POST /user/updateuser':'UserController.updateuser',
  'POST /user/updatepassword':'UserController.updatepassword',


  //uom
  'POST /uom/adduom':'UomController.adduom',
  'POST /uom/edituom':'UomController.edituom',
  'POST /uom/deleteuom':'UomController.deleteuom',
  'POST /uom/getsingleuom':'UomController.getsingleuom',
  'POST /uom/getuom':'UomController.getuom',
  'POST /uom/getmoreuom':'UomController.getmoreuom',


  //tax
  'POST /tax/addtax':'TaxController.addtax',
  'POST /tax/getmoreuom':'TaxController.gettaxes',
  'POST /tax/getmoretax':'TaxController.getmoretax',
  'POST /tax/getsingletax':'TaxController.getsingletax',
  'POST /tax/deletetax':'TaxController.deletetax',
  'POST /tax/updatetax':'TaxController.updatetax',
  'POST /tax/generatetax':'TaxController.generatetax',

  'POST /taxexe/addtaxexe':'TaxexemptionController.addtaxexe',
  'POST /taxexe/gettaxexees':'TaxexemptionController.gettaxexees',
  'POST /taxexe/getsingletaxexe':'TaxexemptionController.getsingletaxexe',
  'POST /taxexe/deletetaxexe':'TaxexemptionController.deletetaxexe',
  'POST /taxexe/updatetaxexe':'TaxexemptionController.updatetaxexe',
  'POST /taxexe/getmoretaxexe':'TaxexemptionController.getmoretaxexe',

  'POST /contact/addcontact':'ContactController.addcontact',
  'POST /contact/getcontact':'ContactController.getcontact',
  'POST /contact/getsinglecontact':'ContactController.getsinglecontact',
  'POST /contact/searchcontact':'ContactController.searchcontact',
  'POST /contact/getbills':'ContactController.getbills',
  //collection
  'POST /collection/addcollection':'CollectionController.addcollection',
  'POST /collection/editcollection':'CollectionController.editcollection',
  'POST /collection/deletecollection':'CollectionController.deletecollection',
  'POST /collection/getsinglecollection':'CollectionController.getsinglecollection',
  'POST /collection/getcollection':'CollectionController.getcollection',
  'POST /collection/morecollection':'CollectionController.morecollection',
  'POST /collection/searchcollection':'CollectionController.searchcollection',
  'POST /collection/searchcollections':'CollectionController.searchcollections',
  //contact
  'POST /contact/getmorecontact':'ContactController.getmorecontact',
  'POST /contact/searchgetmore':'ContactController.searchgetmore',
  'POST /contact/updatecontact':'ContactController.updatecontact',
  'POST /contact/deletecontact':'ContactController.deletecontact',
  'POST /contact/searchcontacttype':'ContactController.searchcontacttype',
  'POST /contact/getcustomeramount':'PosController.getcustomeramount',

  'POST /pos/getreportc':'PosController.getreportc',
  'POST /pos/getreportcbalance':'PosController.getreportcbalance',
  'POST /pos/getpaymentreportc':'PosController.getpaymentreportc',
  'POST /pos/getreportvendor':'PosController.getreportvendor',
  'POST /pos/getreportvendorbalance':'PosController.getreportvendorbalance',
  'POST /pos/getpaymentmadereportc':'PosController.getpaymentmadereportc',
  'POST /pos/daybookreport':'PosController.daybookreport',
  'POST /pos/getreportinvoices':'PosController.getreportinvoices',
  'POST /pos/detailedgst':'PosController.detailedgst',


  //product
  'POST /products/getproductpre':'ProductsController.getproductpre',
  'POST /products/addproduct':'ProductsController.addproduct',
  'POST /products/addproduct1':'ProductsController.addproduct1',
  'POST /products/getsku':'ProductsController.getsku',
  'POST /products/getproducts':'ProductsController.getproducts',
  'POST /products/moreproducts':'ProductsController.moreproducts',
  'POST /products/searchproducts':'ProductsController.searchproducts',
  'POST /products/getsingleproduct':'ProductsController.getsingleproduct',
  'POST /products/deleteproduct':'ProductsController.deleteproduct',
  'POST /products/productedit':'ProductsController.productedit',
  'POST /products/updateproduct':'ProductsController.updateproduct',
  'POST /products/updateproduct1':'ProductsController.updateproduct1',
  'POST /products/addstock':'ProductsController.addstock',
  'POST /products/getinventoryalert':'ProductsController.getinventoryalert',
  'POST /products/getmoreinventoryalert':'ProductsController.getmoreinventoryalert',
  'POST /products/intraproducts':'ProductsController.intraproducts',
  'POST /products/getsinglebarcode':'ProductsController.getsinglebarcode',

  //estimate
  'POST /estimate/getid':'EstimateController.getid',
  'POST /estimate/checkid':'EstimateController.checkid',
  'POST /estimate/addestimate':'EstimateController.addestimate',
  'POST /estimate/updateestimate':'EstimateController.updateestimate',
  'POST /estimate/estimatebyid':'EstimateController.estimatebyid',
  'POST /estimate/getall':'EstimateController.getall',
  'POST /estimate/searchestimate':'EstimateController.searchestimate',
  'POST /estimate/deleteestimate':'EstimateController.deleteestimate',
  'POST /estimate/singleestimate':'EstimateController.singleestimate',
  'POST /estimate/getreportestimate':'EstimateController.getreportestimate',

  //posconfig
  'POST /posconfig/getconfig':'PosconfigController.getconfig',
  'POST /posconfig/adddisc':'PosconfigController.adddisc',
  'POST /posconfig/getposconfig':'PosconfigController.getposconfig',
  //pos
  'POST /pos/getcustomer':'PosController.getcustomer',
  'POST /pos/searchproducts':'PosController.searchproducts',
  'POST /pos/searchcontact':'PosController.searchcontact',
  'POST /pos/getproducts':'PosController.getproducts',
  'POST /pos/searcallproducts':'PosController.searcallproducts',
  'POST /pos/categoryfilter':'PosController.categoryfilter',
  'POST /pos/addfavourite':'PosController.addfavourite',
  'POST /pos/removefavourite':'PosController.removefavourite',
  'POST /pos/categoryfilter1':'PosController.categoryfilter1',
  'POST /pos/reportbycustomer':'PosController.reportbycustomer',
  'POST /pos/reportbyuser':'PosController.reportbyuser',
  'POST /pos/searchfavourite':'PosController.searchfavourite',
  'POST /pos/reportbyitem':'PosController.reportbyitem',
  'POST /pos/salebycustomer':'PosController.salebycustomer',
  'POST /pos/sale':'PosController.sale',
  'POST /pos/singlepostemp':'PosController.singlepostemp',
  'POST /pos/getpaymentammount':'PosController.getpaymentammount',
  //routes for receivables,payables,and today sale
  'POST /pos/getsaledetails':'PosController.getsaledetails',
  'POST /pos/searchsaledetails':'PosController.searchsaledetails',


  //expenses
  'POST /expense/getexpenseid':'ExpensesController.getexpenseid',
  'POST /expense/addexpenses':'ExpensesController.addexpenses',
  'POST /expense/deleteexpense':'ExpensesController.deleteexpense',
  'POST /expense/getbyname':'ExpensesController.getbyname',
  'POST /expense/getbydate':'ExpensesController.getbydate',
  'POST /expense/getmoreexpenses':'ExpensesController.getmoreexpenses',
  'POST /expense/searchexpenses':'ExpensesController.searchexpenses',
  'POST /expense/searchgetmore':'ExpensesController.searchgetmore',
  'POST /expense/addnewexpense':'ExpenselistController.addnewexpense',
  'POST /expense/findexpense':'ExpenselistController.findexpense',
  'POST /expense/getexpense':'ExpensesController.getexpense',
  'POST /expense/singleexpense':'ExpensesController.singleexpense',
  'POST /expense/updateexpenses':'ExpensesController.updateexpenses',
  'POST /expense/getbysinglecategory':'ExpensesController.getbysinglecategory',
  'POST /expense/deleteaddedexpense':'ExpenselistController.deleteaddedexpense',

  //pos
  'POST /pos/savebill':'PosController.savebill',
  'POST /pos/saveinvoice':'PosController.saveinvoice',
  'POST /pos/getall':'PosController.getall',
  'POST /pos/getposcount':'PosController.getposcount',
  'POST /pos/searchpos':'PosController.searchpos',
  'POST /pos/singlepos':'PosController.singlepos',
  'POST /pos/deletebill':'PosController.deletebill',
  'POST /pos/getfavourites':'PosController.getfavourites',
  'POST /pos/getuserproducts':'PosController.getuserproducts',
  'POST /pos/updateinvoice':'PosController.updateinvoice',
  'POST /pos/setdefault':'PosController.setdefault',
  'POST /pos/gettemplates':'PosController.gettemplates',
  'POST /pos/getpos':'PosController.getpos',
  'POST /pos/getretail':'PosController.getretail',
  'POST /invoice/getinvoiceid':'PosController.getinvoiceid',
  'POST /invoice/checkid':'PosController.checkid',




  //payment received
  'POST /paymentreceived/addpayment':'Paymentreceived.paymentreceived',
  'POST /paymentreceived/addbulkpayment':'Paymentreceived.addbulkpayment',  
  'POST /paymentreceived/getall':'Paymentreceived.getall',
  'POST /paymentreceived/getcount':'Paymentreceived.getcount',
  'POST /paymentreceived/searchpayments':'Paymentreceived.searchpayment',
  'POST /paymentreceived/singlepayment':'Paymentreceived.singlepayment',
  'POST /paymentreceived/deletebill':'Paymentreceived.deletebill',
  'POST /paymentreceived/reportbypayment':'Paymentreceived.reportbypayment',

  //purchase
  'POST /purchase/tax':'PurchaseController.tax',
  'POST /purchase/addbill':'PurchaseController.addbill',
  'POST /purchase/getsid':'PurchaseController.getsid',
  'POST /purchase/checkid':'PurchaseController.checkid',
  'POST /purchase/getall':'PurchaseController.getall',
  'POST /purchase/searchpurchase':'PurchaseController.searchpurchase',
  'POST /purchase/singlepurchase':'PurchaseController.singlepurchase',
  'POST /purchase/deletebill':'PurchaseController.deletebill',
  'POST /purchase/searchcontact':'PurchaseController.searchcontact',
  'POST /purchase/updatebill':'PurchaseController.updatebill',
  'POST /purchase/getpaymentammount':'PurchaseController.getpaymentammount',
  'POST /purchase/getpurchase':'PurchaseController.getpurchase',
  'POST /purchase/purchasebyitem':'PurchaseController.purchasebyitem',
  'POST /purchase/singlepurchasetemp':'PurchaseController.singlepurchasetemp',
  'POST /purchaseorder/singlepurchasetemp':'PurchaseorderController.singlepurchasetemp',
  'POST /purchaseorder/getid':'PurchaseorderController.getid',
  'POST /purchaseorder/checkid':'PurchaseorderController.checkid',


  //return
  'POST /return/tax':'ReturnController.tax',
  'POST /return/addbill':'ReturnController.addbill',
  'POST /return/getsid':'ReturnController.getsid',
  'POST /return/checkid':'ReturnController.checkid',
  'POST /return/getall':'ReturnController.getall',
  'POST /return/searchreturn':'ReturnController.searchreturn',
  'POST /return/singlereturn':'ReturnController.singlereturn',
  'POST /return/deletebill':'ReturnController.deletebill',
  'POST /return/searchcontact':'ReturnController.searchcontact',
  'POST /return/updatebill':'ReturnController.updatebill',
  'POST /return/singlereturntemp':'ReturnController.singlereturntemp',
  'POST /return/salereport':'ReturnController.salereport',

  //sale return
  'POST /salereturn/gettax':'SalereturnController.gettax',
  'POST /salereturn/addbill':'SalereturnController.addbill',
  'POST /salereturn/singlereturn':'SalereturnController.singlereturn',
  'POST /salereturn/deletebill':'SalereturnController.deletebill',
  'POST /salereturn/getreturncount':'SalereturnController.getreturncount',
  'POST /salereturn/getall':'SalereturnController.getall',
  'POST /salereturn/searchreturn':'SalereturnController.searchreturn',
  'POST /salereturn/updatebill':'SalereturnController.updatebill',
  'POST /salereturn/returnbyitem':'SalereturnController.returnbyitem',
  'POST /salereturn/salereport':'SalereturnController.salereport',
  'POST /salereturn/getid':'SalereturnController.getid',
  'POST /salereturn/checkid':'SalereturnController.checkid',
  


  //payment made
  'POST /Paymentmade/addpayment':'Paymentmade.paymentmade',
  'POST /Paymentmade/getall':'Paymentmade.getall',
  'POST /Paymentmade/getcount':'Paymentmade.getcount',
  'POST /Paymentmade/searchpayments':'Paymentmade.searchpayment',
  'POST /Paymentmade/singlepaymade':'Paymentmade.singlepaymade',
  'POST /Paymentmade/deletebill':'Paymentmade.deletebill',
  'POST /Paymentmade/addbulkpayment':'Paymentmade.addbulkpayment',
  'POST /Paymentmade/reportbypaymentmade':'Paymentmade.reportbypaymentmade',


  //hold
  'POST /hold/addhold':'HoldController.addhold',
  'POST /hold/restoreholdbills':'HoldController.restoreholdbills',
  'POST /hold/getholdbills':'HoldController.getholdbills',

  //verify
  'POST /user/checkuser':'UserController.checkuser',
  'POST /user/updateexpiredate':'UserController.updateexpiredate',
  'POST /user/adduser':'UserController.adduser',
  'POST /user/getallusers':'UserController.getallusers',
  'POST /user/deleteuser':'UserController.deleteuser',
  'POST /user/updateroleuser':'UserController.updateroleuser',
  'POST /user/getSingleUser':'UserController.getSingleUser',

  //Report
  'POST /products/getinventory':'ProductsController.getinventory',
  'POST /products/getinventoryadjustment':'InventoryAdjustmentController.getinventoryadjustment',
  'POST /products/getstock':'ProductsController.getstock',
  'POST /purchase/reportbycustomer':'PurchaseController.reportbycustomer',
  'POST /purchase/purchasesbycustomer':'PurchaseController.purchasesbycustomer',
  'POST /return/returnbyitem':'ReturnController.returnbyitem',
  'POST /pos/profitlossreport':'PosController.profitlossreport',
  //Bank
  'POST /bank/getdetails':'BankController.getdetails',
  'POST /bank/deletebank':'BankController.deletebank',
  'POST /bank/setdefault':'BankController.setdefault',
  'POST /bank/updatebank':'BankController.updatebank',

  //Inventory Adjustment routes
  'POST /inventory/addnewreason':'InventoryreasonController.addnewreason',
  'POST /inventory/findreason':'InventoryreasonController.findreason',
  'POST /inventory/deleteaddedreason':'InventoryreasonController.deleteaddedreason',

  'POST /inventory/getid':'InventoryAdjustmentController.getid',
  'POST /inventory/checkid':'InventoryAdjustmentController.checkid',
  'POST /inventory/addInventory':'InventoryAdjustmentController.addInventory',
  'POST /inventory/getAllInventory':'InventoryAdjustmentController.getAllInventory',
  'POST /inventory/searchInventory':'InventoryAdjustmentController.searchInventory',
  'POST /inventory/deleteInventory':'InventoryAdjustmentController.deleteInventory',
  'POST /inventory/getSingleBill':'InventoryAdjustmentController.getSingleBill',
  'POST /inventory/searchInventoryProducts':'InventoryAdjustmentController.searchInventoryProducts',
  //Sales Persons routes
  'POST /salesperson/addsalesperson':'SalespersonController.addsalesperson',
  'POST /salesperson/updateSalesPerson':'SalespersonController.updateSalesPerson',
  'POST /salesperson/getAllSalesPerson':'SalespersonController.getAllSalesPerson',
  'POST /salesperson/getSingleSalesPerson':'SalespersonController.getSingleSalesPerson',
  'POST /salesperson/deleteSalesPerson':'SalespersonController.deleteSalesPerson',
  'POST /salesperson/searchSalesperson':'SalespersonController.searchSalesperson',
  'POST /salesperson/getsalesperson':'SalespersonController.getsalesperson',

    //salesorder routes
    'POST /salesorder/getid':'SalesorderController.getid',
    'POST /salesorder/addSalesorder':'SalesorderController.addSalesorder',
    'POST /salesorder/updateSalesorder':'SalesorderController.updateSalesorder',
    'POST /salesorder/Salesorderbyid':'SalesorderController.Salesorderbyid',
    'POST /salesorder/getall':'SalesorderController.getall',
    'POST /salesorder/searchSalesorder':'SalesorderController.searchSalesorder',
    'POST /salesorder/deleteSalesorder':'SalesorderController.deleteSalesorder',
    'POST /salesorder/singlesalesorder':'SalesorderController.singlesalesorder',
    'POST /salesorder/checkid':'SalesorderController.checkid',
    'POST /salesorder/salesorderreport':'SalesorderController.salesorderreport',
    'POST /salesorder/getreportsalesorder':'SalesorderController.getreportsalesorder',
    //overduepayments dashbord routes
    'POST /overdue/getoverduepayment':'PosController.getoverduepayment',
    'POST /overdue/searchOverDuePayment':'PosController.searchOverDuePayment',
};
