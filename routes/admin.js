  
const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');

const immobili = require('../models/immobili');
const tipologie = require('../models/tipologie');

//principale di admin
router.get('/',(req,res)=>{
    res.render('./backend/index.ejs',{ title: 'admin area'});
});

//principale di admin immobili
router.get('/immobili',(req,res)=>{
    immobili.find((err, imm)=>{
        if(err) return console.log(err);
        res.render('./backend/list_immobili.ejs',{
            title: 'immobili presenti',
            immobili: imm
        });
    });
    
});


//ROTTA GET il form di inserimento di un nuovo immobile
router.get('/immobili/add', function (req, res) {
    var i = "";
    tipologie.find((err,tipo)=>{
      if(err) return console.log(err);
        res.render('./backend/add_immobile.ejs',{
        title: 'Nuovo immobile',
        indirizzo: i,
        tipi : tipo
      });
    });
  
});

//ROTTA POST immobili add
router.post('/immobili/add',(req,res)=>{
    var indirizzo = req.body.indirizzo;
    var nameFile = req.files.image.name;
    var tipo = req.body.tipologia;
    var vani = req.body.vani;
    var camere = req.body.camere;
    var bagni = req.body.bagni;
    var titolo = req.body.titolo;
    var s=titolo.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.descrizione;
    var prezzo = req.body.price;

    const immobile = new immobili({
        indirizzo: indirizzo,
        slug: s,
        tipologia: tipo,
        titolo: titolo,
        descrizione: desc,
        prezzo: prezzo,
        vani: vani,
        camere: camere,
        bagni: bagni,
        image: nameFile
    });

    immobile.save((err)=>{
        if(err) return console.log(err);
         var img = req.files.image;
         //creo la cartella in gallery
         var path = "public/images/gallery/"+immobile._id;
         mkdirp(path,(err)=>{
             if(err) return console.log('errore nella creazione di cartelle:'+err);
         });
         var imgPath="public/images/gallery/"+immobile._id+"/"+nameFile;
         img.mv(imgPath,(err)=>{
             if(err) return console.log('errore in upload di file:'+err);
         });
    });

    console.log('indirizzo:'+indirizzo+", File:"+nameFile);
    res.redirect('/admin/immobili');
});

//ROTTA GET delete immobile
router.get('/immobili/delete/:id', function (req, res) {
    
    immobili.findByIdAndRemove(req.params.id,(err)=>{
        if(err) console.log(err);
        
    });
  
});

//ROTTA GET edit immobile
router.get('/immobili/edit/:id', function (req, res) {
    
     tipologie.find((err, tipi)=>{

         immobili.findById(req.params.id, (err, immobile)=>{
             if(err){ 
                    console.log(err);
                    res.redirect('/immobili');
                } else {
                    var galleryDir = "public/images/gallery/"+immobile._id;
                    var galleryImages = null;

                    fs.readdir(galleryDir,(err, files)=>{
                        if(err) {
                            console.log(err);
                        } else {
                            galleryImages = files;

                            res.render('./backend/edit_immobile.ejs', {
                                title: immobile.slug, 
                                id: immobile._id,
                                indirizzo: immobile.indirizzo,
                                slug: immobile.slug,
                                tipologia: immobile.tipologia,
                                tipologie: tipi,
                                titolo: immobile.titolo,
                                descrizione: immobile.descrizione,
                                prezzo: immobile.prezzo,
                                vani: immobile.vani,
                                camere: immobile.camere,
                                bagni: immobile.bagni,
                                image: immobile.image,
                                galleryImages: galleryImages
                            });
                        }
                    });
                }

         });
     });
  
});

//POST images gallery
router.post('/images/gallery/:id',(req,res)=>{

    var productImage = req.files.file;
    var id = req.params.id;
    var path= "public/images/gallery/"+id+"/"+req.files.file.name;
    productImage.mv(path,(err)=>{
        if(err)
            console.log(err);
    });

    res.sendStatus(200);

});



//ROTTA GET di tipologie pagina index di admin tipologie
router.get('/tipologie', function (req, res) {

    tipologie.find((err, tipi)=>{
       if(err) {
         return console.log(err)
        }
       res.render('./backend/tipologie.ejs', {
         'tipologie': tipi ,
         'title' : 'tipi di immobili'
       });
    });
});

router.get('/tipologie/add', function (req, res) {
    res.render('./backend/add_tipologia.ejs',{ 'title': 'Nuova Tipologia'});
    });


  //ROUTER POST tipologie add
router.post('/tipologie/add',(req,res)=>{
    var tipo = req.body.tipologia;
    console.log('tipologia:'+tipo);

    const tipologia = new tipologie({
        tipologia: tipo
    });

    tipologia.save((err,doc)=>{
      if(err) return console.log(err);
      console.log(doc);
      res.redirect('/admin/tipologie');
    });

});

//GET tipologie edit
router.get('/tipologie/edit/:id',(req,res)=>{
     //recupero la tipologia da modificare
     tipologie.findOne({ _id: req.params.id },(err,tipo)=>{
         if(err) return console.log(err);
         res.render('./backend/edit_tipologia.ejs',{
             'title': 'modifica tipologia',
             'tipologia': tipo.tipologia,
             'id': tipo._id
         });
     });
});

//POST edit/tipologie
router.post('/tipologie/edit/:id',(req,res)=>{

    //recupero i dati 
    var tipo = req.body.tipologia;
    var id_tipo = req.params.id;
    //recupero la tipologia
    tipologie.findById(id_tipo,(err, t)=>{
       if(err) return console.log(err);
       t.tipologia = tipo;
       t.save((err)=>{
           if(err) return console.log(err);
           res.redirect('/admin/tipologie');
       })
    });
});

//GET per eliminare una tipologia
router.get('/tipologie/delete/:id',(req,res)=>{
   var id = req.params.id;
   tipologie.findByIdAndRemove(id,(err)=>{
     if(err) return console.log(err);
     res.redirect('/admin/tipologie');
   });
});


module.exports = router;