const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const configdb = require('./config/dbase');
const fileUpload = require('express-fileupload');
const admin_route = require('./routes/admin');

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

//express-fileupload middleware
app.use(fileUpload());

app.use('/admin',admin_route);


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

app.get('/case_da_sogno',(req,res)=>{
  res.render('./frontend/it/chisiamo');
});

app.get('/contatti',(req,res)=>{
  res.render('./frontend/it/chisiamo');
});

app.get('/news',(req,res)=>{
  res.render('./frontend/it/chisiamo');
});




var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Example app listening on port 3000!');
});