const path  = require('path')
const express = require('express')
const app = express()
const  publicDirectory = path.join(__dirname, '../public/')

app.listen(3000, function(err){
    if(err) throw err;
});
