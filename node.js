var mysql = require('mysql');
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

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

/*var usuarios = []
function Usuario(nombreUsuario, contraseña, biografia, fotoDePerfil, email) {
    this.nombreUsuario = nombreUsuario;
    this.contraseña = contraseña;
    this.biografia = biografia;
    this.fotoDePerfil = fotoDePerfil;
    this.email = email;
}*/
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
        /*var usuario = new Usuario(registrar.nombreUsuario, registrar.contraseña, registrar.biografia, registrar.fotoDePerfil, registrar.email)*/
        var usuarioArray = [
            registrar.nombreUsuario, 
            registrar.contraseña, 
            registrar.biografia, 
            registrar.fotoDePerfil, 
            registrar.email
        ];
        /*usuarios.push(usuario)*/
        console.log(usuarioArray)
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
    console.log(actualizar);
    var idUsuario = parseInt(req.params.idUsuario);
    if(isNaN(idUsuario)){
        return res.send('Escriba bien');
    }
    if(actualizar.nombreUsuario == ""){
        return res.send('Escriba su nombre de usuario');
    }
    else if(actualizar.contraseña == ""){
        return res.send('Escriba su contraseña');
    }
    else if(actualizar.email == ""){
        return res.send('Escriba su email');
    }
    else{
        /*var usuario = new Usuario(registrar.nombreUsuario, registrar.contraseña, registrar.biografia, registrar.fotoDePerfil, registrar.email)*/
        console.log(actualizar.nombreUsuario);
        var usuarioArray = [
            actualizar.nombreUsuario, 
            actualizar.contraseña, 
            actualizar.biografia, 
            actualizar.fotoDePerfil, 
            actualizar.email
        ];
        /*usuarios.push(usuario)*/
        console.log(usuarioArray)
        con.query('UPDATE Usuarios SET nombreUsuario = ?, contraseña = ?, biografia = ?, fotoDePerfil = ?, email = ?', usuarioArray, function(err,result){
            if(err){
                throw err;
            }
            res.send('actualizar el usuario: ' + result.insertId);
        });
    } 
});

app.get('/eliminar', function(req,res){
    
});
