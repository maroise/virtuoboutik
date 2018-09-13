'use strict';

const express = require('express');
const app = express();
let debug = true;
const mongodb= require('mongodb');
let chalk = require('chalk');


// middleware pour le fichier statiques
app.use(express.static(`static`));

// middlewareS pour l'API JSON
app.get('/api/Products', function(req,resp){
    debug && console.log(chalk.red('dedans'));
    mongodb.MongoClient.connect('mongodb://localhost:27017',
    {
        useNewUrlParser:true
    }, function(error, client){
       if(error){
        debug && console.log(chalk.red('Connexion impossible!'));
        next('Erreur fatal !');
       }
       else{
           debug && console.log('Connexion à DataBase réussi !');
           let db =client.db('magazin');
           db.collection('Products', function(err, theCollection){
               if(err){
                   debug && console.log(chalk.red('Collection non disponible'));
               }else{
                   let cursor= theCollection.find({},{});
                   cursor.toArray(function(error,datas){
                       if(error){
                           debug && console.log(chalk.red('Impossible d\'interroger la collection produits'));
                       }else{
                            // affiches les datas
                            debug && console.log(chalk.green('affiche produits'));
                            resp.json(datas);
                       }
                      
                   })
                
               }
           })
       }
    })

});

// Toutes les autres requêtes HTTP sont traitées par ce middleware
// Toutes les autres requêtes HTTP sont traitées par ce middleware
app.all('/', function(request, response){
    debug && console.log('[INFO] : Request "/" root on doit arriver à la racine du site');
  });



app.listen(80,"localhost",function(){
    console.log('Srv Express lancé !!!');
});

