if(process.env.NODE_ENV === "production"){
    module.exports = {
        mongoURI : "mongodb://mauri:lazk21@ds037581.mlab.com:37581/real-estate"
    }
}else{
    
    module.exports = {
        mongoURI: 'mongodb://localhost/real-estate'
    }
}
