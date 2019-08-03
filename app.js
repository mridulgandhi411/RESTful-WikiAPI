//jshint esversion: 6

const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const mongoose = require("mongoose");

app = express();

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser : true});

const articleSchema = new mongoose.Schema ({
  title : String,
  content : String
});

const Article = mongoose.model("Article",articleSchema);


app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(err) {
      res.send(err);
    } else {
      res.send(foundArticles);
    }
  });
})

.post(function(req,res){

  const newArticle = new Article ({
    title : req.body.title,
    content : req.body.content
  });

  newArticle.save(function(err){
    if(err) {
      res.send(err);
    } else {
      res.send("Succesfully saved in database");
    }
  });

})

.delete(function(req,res){
  Article.deleteMany({},function(err){
    if(err) {
      res.send(err);
    } else {
      res.send("Succesfully Deleted All the articles");
    }
  });
});


app.route("/articles/:postName")

.get(function(req,res){

  Article.findOne({title : req.params.postName},function(err,foundArticle) {
    if(foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No Such Article Was Found.");
    }
  });
})

.put(function(req,res) {
  Article.update( { title : req.params.postName } ,
                   {title : req.body.title , content : req.body.content},
                    {overwrite : true},
                  function(err) {
                    if(!err) {
                      res.send("Updated Succesfully!");
                    }
                  });
})

.patch(function(req,res){
  Article.update( {title : req.params.postName} ,
                   {$set : req.body},
                    function(err) {
                      if(!err) {
                        res.send("Succesfully Updated");
                      } else {
                        res.send(err);
                      }
                    });
})

.delete(function(req,res){
  Article.deleteOne({ title : req.params.postName} ,
                    function(err) {
                      if(!err) {
                        res.send("Succesfully Deleted!");
                      } else {
                        res.send(err);
                      }
                    });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
