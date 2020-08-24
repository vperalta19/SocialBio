var mysql = require('mysql');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

const path  = require('path')
const  publicDirectory = path.join(__dirname, '../public/')
app.use(express.static(publicDirectory));

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'SocialBio2020',
    database: 'SocialBio'
});

con.connect(function(err){
    if(err) throw err;

    app.listen(3000, function(err){
        if(err) throw err;
    });
});


app.post('/registrar', function(req,res){
    var registrar = req.body;
    if(registrar.nombreUsuario == ""){
        return res.send('Escriba su nombre de usuario');
    }
    else if(registrar.contraseña == ""){
        return res.send('Escriba su contraseña');
    }
    else if(registrar.email == ""){
        return res.send('Escriba su email');
    }
    else{
        var usuarioArray = [
            registrar.nombreUsuario, 
            registrar.contraseña, 
            registrar.biografia, 
            registrar.fotoDePerfil, 
            registrar.email
        ];
        con.query('INSERT INTO Usuarios (nombreUsuario, contraseña, biografia, fotoDePerfil, email) VALUES (?,?,?,?,?)', usuarioArray, function(err,result){
            if(err){
                throw err;
            }
            res.send('cree el usuario: ' + result.insertId);
        });
    } 
});

app.put('/actualizar/:idUsuario', function(req,res){
    var actualizar = req.body;
    var idUsuario = parseInt(req.params.idUsuario);
    if(isNaN(idUsuario)){
        return res.send('Escriba bien');
    }
    else{
        var usuarioArray = [
            actualizar.nombreUsuario, 
            actualizar.contraseña, 
            actualizar.biografia, 
            actualizar.fotoDePerfil, 
            actualizar.email
        ];
        con.query('UPDATE Usuarios SET nombreUsuario = ?, contraseña = ?, biografia = ?, fotoDePerfil = ?, email = ?', usuarioArray, function(err,result){
            if(err){
                throw err;
            }
            res.send('actualizar el usuario: ' + result.insertId);
        });
    } 
});

app.get('/eliminar/:idUsuario', function(req,res){
    var idUsuario = parseInt(req.params.idUsuario);
    con.query('DELETE FROM Usuarios WHERE idUsuario == ?', idUsuario, function(err,result){
        if(err){
            throw err;
        }
        res.send('actualizar el usuario: ' + result.insertId);
    });
});
