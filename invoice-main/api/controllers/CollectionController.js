/**
 * CollectionController
 *
 * @description :: Server-side logic for managing collections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addcollection:(req,res)=>{
    Collection.findOne({collectioncode:req.param('collectioncode')}).exec((err,result)=>{
      if(result){
        return res.json(401, {err: 'Collectioncode is already exists'});
      }
      else{
        Collection.create({
            collectiontitle:req.param('collectiontitle'),
            description:req.param('description'),
            collectioncode:req.param('collectioncode')
          }).exec((err,created)=>{
            if(err) return res.negotiate(err);
            Collection.find({limit:req.param('limit')}).exec((err,collections)=> {
              if (err) return res.negotiate(err);
              return res.json({collections: collections})
            })
        })
      }
  })
  },
  editcollection:(req,res)=>{
    Collection.update({
        id:req.param('id')},
      {collectiontitle:req.param('collectiontitle'),
        description:req.param('description'),
        collectioncode:req.param('collectioncode')
      }).exec((err,updated)=>{
      if(err) return res.negotiate(err);
      Collection.find({limit:req.param('limit'),skip:req.param('skip')}).exec((err,collections)=> {
        if (err) return res.negotiate(err);
        return res.json({collections: collections})
      })
    })
  },
  getsinglecollection:(req,res)=>{
    Collection.findOne({id:req.param('id')}).exec((err,collection)=>{
      if(err) return res.negotiate(err);
      return res.json({collection:collection})
    })
  },
  deletecollection:(req,res)=>{
    Collection.destroy({id:req.param('id')}).exec((err,deleted)=>{
      if(err) return res.negotiate(err);
      Collection.find({limit:req.param('limit'),skip:req.param('skip')}).exec((err,collections)=> {
        if (err) return res.negotiate(err);
        Collection.count().exec((err,count)=>{
          if (err) return res.negotiate(err);
        return res.json({collections: collections,count:count})
      })
      })
    })
  },
  getcollection:(req,res)=>{
      Collection.count().exec((err, count) => {
        if (err) return res.negotiate(err);
        return res.json({count:count})
    })
  },
  morecollection:(req,res)=>{
    Collection.find({limit:req.param('limit'),skip:req.param('skip')}).exec((err,collections)=> {
      if (err) return res.negotiate(err);
      Collection.count().exec((err, count) => {
        if (err) return res.negotiate(err);
        return res.json({collections: collections, count: count})
      })
    })
  },
  searchcollection:(req,res)=>{
    Collection.find({
      or:[{collectiontitle:{'contains':req.param('searchtext')}}
      ,{collectioncode:{'contains':req.param('searchtext')}}]
      ,limit:10
    }).exec((err,collections)=>{
      if(err) return res.negotiate(err);
      return res.json({collections: collections})
    })
  },
  searchcollections:(req,res)=>{
    Collection.find({
      or:[{collectiontitle:{'contains':req.param('searchtext')}}
        ,{collectioncode:{'contains':req.param('searchtext')}}]
      ,skip:req.param('skip'),limit:req.param('limit')
    }).exec((err,collections)=> {
      if (err) return res.negotiate(err);
      Collection.count({
        or: [{collectiontitle: {'contains': req.param('searchtext')}}
          , {collectioncode: {'contains': req.param('searchtext')}}]
      }).exec((err, count) => {
        if (err) return res.negotiate(err);
        return res.json({collections: collections,count:count})
      })
    })
  }
};

