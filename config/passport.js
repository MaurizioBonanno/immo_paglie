const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

//schema e modello utenti
require('../models/utenti');
const utenti = mongoose.model('Utenti');

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'name'},(name,password,done)=>{
        console.log(password);
        utenti.findOne({
            name: name
        }).then(utente => {
            if(!utente){
                return(done(null , false, { message: 'utente non trovato '}));
            }else{
                if(utente.password == password){
                    console.log('password coincide');
                    return done(null, utente);
                }
                else{
                    return done(null, false , { message: 'password errata'});
                }
            }
        })
    }));

    passport.serializeUser(function(utente, done) {
        done(null, utente.id);
      });
      
    passport.deserializeUser(function(id, done) {
        utenti.findById(id, function(err, utente) {
          done(err, utente);
        });
      });
};

