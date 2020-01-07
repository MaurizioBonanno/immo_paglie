const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const configdb = require('./config/dbase');
const fileUpload = require('express-fileupload');
const admin_route = require('./routes/admin');
const fs = require('fs-extra');
const passport = require('passport');


//SCHEMA E MODELLO
const news = require('./models/news');
const immobili = require('./models/immobili');
const utenti = require('./models/utenti');

//connetto a mongodb
mongoose.connect(configdb.mongoURI , {useUnifiedTopology: true, useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connesso a MongoDb');
});

//inizializzo l'app
const app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//set public folder
app.use(express.static(path.join(__dirname, '/public/')));
app.use(require('cookie-parser')());
app.use(require('express-session')({
  secret:'keyboard cat',
  resave: true,
  saveUninitialized: true
}));



//express-fileupload middleware
app.use(fileUpload());

app.use('/admin',admin_route);

//PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

//INTEGRAZIONE FILE CONFIG PASSPORT
require('./config/passport')(passport);



app.get('/', function (req, res) {
  res.render('./frontend/it/index.ejs');
});

app.get('/chi_siamo',(req,res)=>{
  res.render('./frontend/it/chisiamo');
});

app.get('/per_comprare',(req,res)=>{
  res.render('./frontend/it/comprare');
});

app.get('/per_vendere',(req,res)=>{
  res.render('./frontend/it/vendere');
});

app.get('/valutazioni',(req,res)=>{
  res.render('./frontend/it/valutazioni');
});


//ROTTA GET per la vetrina immobiliare
app.get('/case_da_sogno',(req,res)=>{
  immobili.find((err,listing)=>{
    if(err) return console.log(err);
    res.render('./frontend/it/listing', {
      title: 'listino immobiliare',
      immobili: listing
    });
  });
  
});

app.get('/contatti',(req,res)=>{
  res.render('./frontend/it/contatti');
});


//ROTTA GET PER LE NEWS
app.get('/news',(req,res)=>{
  news.find((err,docs)=>{
    if(err) return console.log(err);
    res.render('./frontend/it/list_news',{
      title: 'news',
      news: docs
    });
  });
  
});

//ROTTA GET PER La singola new
app.get('/new/:id',(req,res)=>{
  news.findById(req.params.id , (err,doc)=>{
    if(err) return console.log(err);
    res.render('./frontend/it/new',{
      title: 'new',
      img: doc.image,
      titolo: doc.titolo,
      desc: doc.descrizione,
      id: doc._id
    });
  });
  
});

//ROTTA GET per singolo immobile
app.get('/casa/:id', (req,res) => {
    var id=req.params.id;
    immobili.findById(id,(err, immobile)=>{
      if(err){
        console.log(err);
        res.redirect('/case_da_sogno');
      }else{
        var galleryDir = "public/images/gallery/"+immobile._id;
        var galleryImages = null;

        fs.readdir(galleryDir,(err,files)=>{
             if(err){
               console.log(err);
               res.redirect('/case_da_sogno');
             }else{
               galleryImages = files;
               
               res.render('./frontend/it/casa',{
                  title: immobile.slug,
                  id: immobile._id,
                  indirizzo: immobile.indirizzo,
                  tipologia: immobile.tipologia,
                  titolo: immobile.titolo,
                  descrizione: immobile.descrizione,
                  vani: immobile.vani,
                  camere: immobile.camere,
                  bagni: immobile.bagni,
                  prezzo: immobile.prezzo,
                  image: immobile.image,
                  galleryImages: galleryImages
               });
             }
        });
      }

    });
    
});

app.get('/login',(req,res)=>{
  res.render('./frontend/it/login');
});

//crea nuovo utente
app.post('/sign-in',(req,res)=>{
  var name = req.body.name;
  var pssw = req.body.password;
  utenti.findOne({ name: req.body.name}).then(utente => {
    if(utente){
      console.log('utente: '+utente.name);
      res.send('utente: '+utente.name+',pass:'+utente.password)
    }else{
      const nuovoUtente = new utenti({
        name: req.body.name,
        password: req.body.password
      });

      nuovoUtente.save().then(utente =>{
        res.send('utente salvato');
      });
    }
     
  });
});

//LOGIN
app.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    succesRedirect: '/admin',
    failureRedirect: '/'
  })(req,res,next);

});




var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});