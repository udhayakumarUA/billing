/**
 * ProductsController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var path = require('path');
module.exports = {
  getproductpre:(req,res)=>{
    Uom.find({userid:req.param('userid'),type:'C'}).exec((err,uoms)=> {
      if (err) return res.negotiate(err)
      Uom.find({userid:req.param('userid'),type: 'D'}).exec((err, uoms1) => {
        if (err) return res.negotiate(err)
        Tax.find({userid:req.param('userid'),type: 'UTGST'}).exec((err, utgsts) => {
          if (err) return res.negotiate(err)
          Tax.find({userid:req.param('userid'),type: 'CESS'}).exec((err, cesss) => {
            if (err) return res.negotiate(err)
            Tax.find({userid:req.param('userid'),type: 'IGST'}).exec((err, igsts) => {
              if (err) return res.negotiate(err)
              Tax.find({userid:req.param('userid'),type: 'CGST'}).exec((err, cgsts) => {
                if (err) return res.negotiate(err)
                Tax.find({userid:req.param('userid'),type: 'SGST'}).exec((err, sgsts) => {
                  if (err) return res.negotiate(err)
                  return res.json({
                    uoms: uoms,
                    uoms1: uoms1,
                    utgsts:utgsts,
                    cesss: cesss,
                    igsts: igsts,
                    cgsts: cgsts,
                    sgsts: sgsts
                  })
                })
              })
            })
          })
        })
      })
    })
  },
  addproduct:(req,res)=>{
    if (req.method === 'POST') {
      var tempLocation = process.cwd() + '/.tmp/public/images/uploads/';

      mkdirp(tempLocation, function (err) {
        if (err) return res.send(500, err);
        // Start uploading the image
        req.file('avatar').upload({
          dirname: process.cwd() + '/assets/images/uploads/'
        }, function (err, uploadedFiles) {
          if (err) {

            return sails.log.error(err);
          }

          // If no files were uploaded, respond with an error.
          if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');
          var filename = path.basename(uploadedFiles[0].fd);
          // var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
          var uploadLocation = process.cwd() + '/assets/images/uploads/';
          var protocol = req.connection.encrypted ? 'https' : 'http';
          var baseURL = protocol + '://' + req.headers.host;
          var avatarUrl = util.format('%s/images/uploads/%s', baseURL, filename);
          var imagedir = '/images/uploads/' + filename;
          //Copy the file to the temp folder so that it becomes available immediately
          var stream = fs.createReadStream(uploadLocation + filename)
            .pipe(fs.createWriteStream(tempLocation + filename));

          // Handle errors from the file stream
          stream.on('error', function (error) {
            console.log("Caught", error);
          });
          Collection.update({id: req.param('collection')},{used:true})
          .exec((result)=>{
            console.log('updated')
          })
            Products.create({userid:req.param('userid'),
              imagename: filename,
              imageurl: avatarUrl,
              imagedir: imagedir,
              itemtype: req.param('itemtype'),
              productname: req.param('productname'),
              unit: req.param('unit'),
              collection: req.param('collection'),
              sku: req.param('sku'),
              hsn: req.param('hsn'),
              salesrate: req.param('salesrate'),
              purchaserate: req.param('purchaserate'),
              mrp:req.param('mrp'),
              prices:req.param('prices'),
              taxpreference: req.param('taxpreference'),
              reason: req.param('reason'),
              sgst: req.param('sgst'),
              cgst: req.param('cgst'),
              igst: req.param('igst'),
              cess: req.param('cess'),
              utgst: req.param('utgst'),
              trackinventary: req.param('trackinventary'),
              inventoryalert:req.param('inventoryalert'),
              openingstock:req.param('openingstock'),
              stockinhand:req.param('openingstock'),
              openingstockperrate:req.param('openingstockperrate'),
              barcode:req.param('barcode'),
              inclusive:req.param('inclusive'),
              purchaseinclusive:req.param('purchaseinclusive')
            }).exec((err, updated) => {
              if (err) {
                return res.negotiate(err)
              }
              return res.json({message: 'created'})

            });

        })
      })
    }
  },
  addproduct1:(req,res)=>{
    var filename = 'default.jpg';
    var protocol = req.connection.encrypted ? 'https' : 'http';
    var baseURL = protocol + '://' + req.headers.host;
    var avatarUrl = util.format('%s/images/uploads/%s', baseURL, filename);
    var imagedir = '/images/uploads/' + filename;

    Collection.update({id: req.param('collection')},{used:true})
    .exec((result)=>{
      console.log('updated')
    })
    Products.create({userid:req.param('userid'),
      imagename: filename,
      imageurl: avatarUrl,
      imagedir: imagedir,
      itemtype: req.param('itemtype'),
      productname: req.param('productname'),
      unit: req.param('unit'),
      collection: req.param('collection'),
      sku: req.param('sku'),
      hsn: req.param('hsn'),
      salesrate: req.param('salesrate'),
      purchaserate: req.param('purchaserate'),
      mrp:req.param('mrp'),
      prices:req.param('prices'),
      taxpreference: req.param('taxpreference'),
      reason: req.param('reason'),
      sgst: req.param('sgst'),
      cgst: req.param('cgst'),
      igst: req.param('igst'),
      cess: req.param('cess'),
      utgst: req.param('utgst'),
      trackinventary: req.param('trackinventary'),
      inventoryalert:req.param('inventoryalert'),
      openingstock:req.param('openingstock'),
      stockinhand:req.param('openingstock'),
      openingstockperrate:req.param('openingstockperrate'),
      barcode:req.param('barcode'),
      inclusive:req.param('inclusive'),
      purchaseinclusive:req.param('purchaseinclusive')
    }).exec((err, updated) => {
      if (err) {
        return res.negotiate(err)
      }
      return res.json({message: 'created'})

    });
  },
  getsku:(req,res)=>{
    Products.count({userid:req.param('userid'),collection:req.param('id')}).exec((err,productno)=>{
      if (err) {
        return res.negotiate(err)
      }
      console.log(productno);
      console.log('enter')
      return res.json({productno:productno})
    })
  },
  getproducts:(req,res)=>{
    Products.find({userid:req.param('userid')}).exec((err, result) => {
      if (err) return res.negotiate(err);
    Products.count({userid:req.param('userid')}).exec((err, count) => {
      if (err) return res.negotiate(err);
      return res.json({count:count,result:result})
    })
  })
  },
  intraproducts:(req,res)=>{
    Products.find({userid:req.param('userid'),id:req.param('productsid'),limit:1000}).exec((err,products)=>{
      if (err) return res.negotiate(err);
     var sorted = req.param('productsid').map((i) => products.find((o) => o.id === i));
      return res.json({products:sorted})
    })
  },

  getinventory:(req,res)=>{
    Products.find({userid:req.param('userid'),sort:'stockinhand ASC',trackinventary:true}).exec((err, inventory) => {
      if (err) return res.negotiate(err);
      return res.json({inventory:inventory})
    })
  },
  getinventoryalert:(req,res)=>{
    Products.native(function(err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([
        {
          $match: {
            userid:req.param('clientid'),
            user:req.param('id'),
            // date: { $gte: date, $lte: date1}
          }},
    {
        "$addFields": {
            "isGreater": { "$cmp": [ "$stockinhand", "$inventoryalert" ] }
        }
    },
    { "$match": { "isGreater": -1 ,"trackinventary":true,userid:req.param('userid')}},
    { $limit : 1000 }
]).toArray(function (err, results) {
        if (err) return res.serverError(err);
        return res.json({stocks:results})
      })
})
  },
  getmoreinventoryalert:(req,res)=>{
    Products.native(function(err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([
        {
          $match: {
            userid:req.param('clientid'),
            user:req.param('id'),
            // date: { $gte: date, $lte: date1}
          }},
    {
        "$addFields": {
            "isGreater": { "$cmp": [ "$stockinhand", "$inventoryalert" ] }
        }
    },
    { "$match": { "isGreater": -1 ,"trackinventary":true,userid:req.param('userid')}},
    {$skip:req.param('skip')},
    { $limit : 1000 }
]).toArray(function (err, results) {
        if (err) return res.serverError(err);
        return res.json({stocks:results})
      })
})
  },

  getstock:(req,res)=>{
    Products.find({userid:req.param('userid'),sort:'stockinhand ASC',trackinventary:true,limit:10}).exec((err, inventory) => {
      if (err) return res.negotiate(err);
      return res.json({inventory:inventory})
    })
  },


  moreproducts:(req,res)=>{
    Products.find({userid:req.param('userid'),limit:req.param('limit'),skip:req.param('skip')})
      .populate('collection')
      .exec((err,products)=> {
      if (err) return res.negotiate(err);
      Products.count({userid:req.param('userid')}).exec((err, count) => {
        if (err) return res.negotiate(err);
        return res.json({products: products, count: count})
      })
    })
  },

  searchproducts:(req,res)=>{
    Products.find({userid:req.param('userid'),
      or:[{productname:{'contains':req.param('searchtext')}}
        ,{sku:{'contains':req.param('searchtext')}}]
      ,skip:req.param('skip'),limit:req.param('limit')
    })
      .populate('collection')
      .exec((err,products)=> {
      if (err) return res.negotiate(err);
      Products.count({userid:req.param('userid'),
        or: [{productname: {'contains': req.param('searchtext')}}
          , {sku: {'contains': req.param('searchtext')}}]
      }).exec((err, count) => {
        if (err) return res.negotiate(err);
        return res.json({products: products,count:count})
      })
    })
  },
  updateproduct:(req,res)=>{
    if (req.method === 'POST') {
      var tempLocation = process.cwd() + '/.tmp/public/images/uploads/';

      mkdirp(tempLocation, function (err) {
        if (err) return res.send(500, err);
        // Start uploading the image
        req.file('avatar').upload({
          dirname: process.cwd() + '/assets/images/uploads/'
        }, function (err, uploadedFiles) {
          if (err) {

            return sails.log.error(err);
          }

          // If no files were uploaded, respond with an error.
          if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');
          var filename = path.basename(uploadedFiles[0].fd);
          // var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
          var uploadLocation = process.cwd() + '/assets/images/uploads/';
          var protocol = req.connection.encrypted ? 'https' : 'http';
          var baseURL = protocol + '://' + req.headers.host;
          var avatarUrl = util.format('%s/images/uploads/%s', baseURL, filename);
          var imagedir = '/images/uploads/' + filename;
          //Copy the file to the temp folder so that it becomes available immediately
          var stream = fs.createReadStream(uploadLocation + filename)
            .pipe(fs.createWriteStream(tempLocation + filename));

          // Handle errors from the file stream
          stream.on('error', function (error) {
            console.log("Caught", error);
          });
          Collection.update({id: req.param('collection')},{used:true})
          .exec((result)=>{
            console.log('updated')
          })
          Products.update({id:req.param('id')},{
            imagename: filename,
            imageurl: avatarUrl,
            imagedir: imagedir,
            itemtype: req.param('itemtype'),
            productname: req.param('productname'),
            unit: req.param('unit'),
            collection: req.param('collection'),
            sku: req.param('sku'),
            hsn: req.param('hsn'),
            salesrate: req.param('salesrate'),
            purchaserate: req.param('purchaserate'),
            mrp:req.param('mrp'),
            prices:req.param('prices'),
            taxpreference: req.param('taxpreference'),
            reason: req.param('reason'),
            sgst: req.param('sgst'),
            cgst: req.param('cgst'),
            igst: req.param('igst'),
            cess: req.param('cess'),
            utgst: req.param('utgst'),
            trackinventary: req.param('trackinventary'),
            inventoryalert:req.param('inventoryalert'),
            openingstock:req.param('openingstock'),
            openingstockperrate:req.param('openingstockperrate'),
            barcode:req.param('barcode'),
            inclusive:req.param('inclusive'),
            purchaseinclusive:req.param('purchaseinclusive')
          }).exec((err, updated) => {
            if (err) {
              return res.negotiate(err)
            }
            return res.json({message: 'updated'})

          });

        })
      })
    }
  },
  updateproduct1:(req,res)=>{
    Collection.update({id: req.param('collection')},{used:true})
    .exec((result)=>{
      console.log('updated')
    })
    Products.update({id:req.param('id')},{
      itemtype: req.param('itemtype'),
      productname: req.param('productname'),
      unit: req.param('unit'),
      collection: req.param('collection'),
      sku: req.param('sku'),
      hsn: req.param('hsn'),
      salesrate: req.param('salesrate'),
      purchaserate: req.param('purchaserate'),
      mrp:req.param('mrp'),
      prices:req.param('prices'),
      taxpreference: req.param('taxpreference'),
      reason: req.param('reason'),
      sgst: req.param('sgst'),
      cgst: req.param('cgst'),
      igst: req.param('igst'),
      cess: req.param('cess'),
      utgst: req.param('utgst'),
      trackinventary: req.param('trackinventary'),
      inventoryalert:req.param('inventoryalert'),
      openingstock:req.param('openingstock'),
      openingstockperrate:req.param('openingstockperrate'),
      barcode:req.param('barcode'),
      inclusive:req.param('inclusive'),
      purchaseinclusive:req.param('purchaseinclusive')
    }).exec((err, updated) => {
      if (err) {
        return res.negotiate(err)
      }
      return res.json({message: 'updated'})

    });
  },
  getsingleproduct:(req,res)=>{
    Products.findOne({id:req.param('id')})
    .populate('collection')
    .exec((err,product)=>{
      if(err) return res.negotiate(err);
      return res.json({product:product})
    })
  },
  getsinglebarcode:(req,res)=>{
    Products.findOne({userid:req.param('userid'),barcode:req.param('barcode')})
    .populate('collection')
    .exec((err,product)=>{
      if(err) return res.negotiate(err);
      return res.json({product:product})
    })
  },
  addstock:(req,res)=>{
    Products.update({userid:req.param('userid'),id:req.param('id')},{stockinhand:req.param('stock')}).exec((err,product)=>{
      if(err) return res.negotiate(err);
        Products.findOne({id:req.param('id')})
            .populate('collection')
            .exec((err,product)=>{
                if(err) return res.negotiate(err);
                return res.json({product:product})
            })
    })
  },
  deleteproduct:(req,res)=>{
    Products.destroy({id:req.param('id')}).exec((err,deleted)=>{
      if(err) return res.negotiate(err);
          return res.json({message:'deleted'})
        })
  },
  productedit:(req,res)=>{
    Products.findOne({userid:req.param('userid'),id:req.param('id')})
      .populate('collection')
      .exec((err,product)=> {
      if (err) return res.negotiate(err);
      Uom.find({userid:req.param('userid'),type: 'C'}).exec((err, uoms) => {
        if (err) return res.negotiate(err)
        Uom.find({userid:req.param('userid'),type: 'D'}).exec((err, uoms1) => {
          if (err) return res.negotiate(err)
          Tax.find({userid:req.param('userid'),type: 'UTGST'}).exec((err, utgsts) => {
            if (err) return res.negotiate(err)
            Tax.find({userid:req.param('userid'),type: 'CESS'}).exec((err, cesss) => {
              if (err) return res.negotiate(err)
              Tax.find({userid:req.param('userid'),type: 'IGST'}).exec((err, igsts) => {
                if (err) return res.negotiate(err)
                Tax.find({userid:req.param('userid'),type: 'CGST'}).exec((err, cgsts) => {
                  if (err) return res.negotiate(err)
                  Tax.find({userid:req.param('userid'),type: 'SGST'}).exec((err, sgsts) => {
                    if (err) return res.negotiate(err)
                    return res.json({
                      uoms: uoms,
                      uoms1: uoms1,
                      utgsts: utgsts,
                      cesss: cesss,
                      igsts: igsts,
                      cgsts: cgsts,
                      sgsts: sgsts,
                      product:product
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }
};

