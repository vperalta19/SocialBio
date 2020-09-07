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

//API USUARIO

app.post('/registrarUsuario', function(req,res){
    var registrar = req.body;
    con.query('SELECT * FROM Usuarios WHERE usuario = ?', registrar.usuario, function(err,result){
        
        if(err){
            throw err;
        }
        if (result.usuario != null){
            return res.send('El usuario ya existe');
        }
    });
    if(registrar.usuario == ""){
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
            registrar.nombre, 
            registrar.apellido, 
            registrar.usuario, 
            registrar.contraseña, 
            registrar.biografia, 
            registrar.fotoDePerfil, 
            registrar.email
        ];
        con.query('INSERT INTO Usuarios (nombre, apellido, usuario, contraseña, biografia, fotoDePerfil, email) VALUES (?,?,?,?,?,?,?)', usuarioArray, function(err,result){
            if(err){
                throw err;
            }
            res.send('cree el usuario: ' + result.insertId);
        });
    } 
});

app.put('/editarUsuario/:usuario', function(req,res){
    var actualizar = req.body;
    var usuario = req.params.usuario;
    var usuarioArray = [
        actualizar.nombre,
        actualizar.apellido,
        actualizar.usuario, 
        actualizar.contraseña, 
        actualizar.biografia, 
        actualizar.fotoDePerfil, 
        actualizar.email,
        usuario
    ];
    con.query('UPDATE Usuarios SET nombre = ?, apellido = ?,usuario = ?, contraseña = ?, biografia = ?, fotoDePerfil = ?, email = ? WHERE usuario = ?', usuarioArray, function(err,result){
        if(err){
            throw err;
        }
        res.send('se actualizo correctamente');
    });
});

app.get('/eliminarUsuario/:usuario', function(req,res){
    var usuario = req.params.usuario;
    con.query('DELETE FROM Usuarios WHERE usuario = ?', usuario, function(err,result){
        if(err){
            throw err;
        }
        res.send('se elimino correctamente');
    });
});

//API PUBLICACIONES

app.post('/publicar', function(req,res){
    var publicar = req.body;
    if(publicar.descripcion == "" && publicar.multimedia == ""){
        return res.send('Debe agregar contenido a su publicacion');
    }
    else{
        var publicacionArray = [
            publicar.seccion,
            publicar.descripcion,
            publicar.multimedia,
            publicar.usuario
        ];
        con.query('INSERT INTO Publicaciones (descripcion,multimedia,usuario) VALUES (?,?,?)', publicacionArray, function(err,result){
            if(err){
                throw err;
            }
            res.send('publicacion insertada correctamente');
        });
    } 
});

app.put('/editarPublicacion/:idPublicacion', function(req,res){
    var actualizar = [req.body.descripcion, req.body.seccion, req.params.idPublicacion];
    con.query('UPDATE Publicaciones SET seccion = ?,descripcion = ? WHERE idPublicacion = ?', actualizar, function(err,result){
        if(err){
            throw err;
        }
        res.send('se actualizo correctamente');
    });
});

app.get('/eliminarPublicacion/:idPublicacion', function(req,res){
    var publicacion = req.params.idPublicacion;
    con.query('DELETE FROM Publicaciones WHERE idPublicacion = ?', publicacion, function(err,result){
        if(err){
            throw err;
        }
        res.send('se elimino correctamente');
    });
});

//API COMENTARIOS
app.post('/comentar', function(req,res){
    var comentar = req.body;
    if(comentar.comentario == ""){
        return res.send('Su comentario no puede estar vacio');
    }
    else{
        var comentarioArray = [
            comentar.comentario,
            comentar.idPublicacion,
            comentar.usuario
        ];
        con.query('INSERT INTO Comentarios (comentario,idPublicacion,usuario) VALUES (?,?,?)', comentarioArray, function(err,result){
            if(err){
                throw err;
            }
            res.send('comentario insertado correctamente');
        });
    } 
});

app.put('/editarComentario/:idComentario', function(req,res){
    var actualizar = [req.body.comentario, req.params.idComentario];
    con.query('UPDATE Comentarios SET comentario = ? WHERE idComentario = ?', actualizar, function(err,result){
        if(err){
            throw err;
        }
        res.send('se actualizo correctamente');
    });
});

app.get('/eliminarComentario/:idComentario', function(req,res){
    var comentario = req.params.idComentario;
    con.query('DELETE FROM Comentarios WHERE idComentario = ?', comentario, function(err,result){
        if(err){
            throw err;
        }
        res.send('se elimino correctamente');
    });
});


//API LIKE
app.post('/like', function(req,res){
    var like = req.body;
    var likeArray = [
        like.idPublicacion,
        like.usuario
    ];
    con.query('INSERT INTO Likes (idPublicacion,usuario) VALUES (?,?)', likeArray, function(err,result){
        if(err){
            throw err;
        }
        res.send('like insertado correctamente');
    });
});

app.get('/dislike/:idLike', function(req,res){
    con.query('DELETE FROM Likes WHERE idLike = ?', req.params.idLike, function(err,result){
        if(err){
            throw err;
        }
        res.send('se elimino correctamente');
    });
});

//API FEED
app.get('/feed/:usuario', function(req,res){
    con.query('SELECT * FROM Publicaciones WHERE usuario = ?',req.params.usuario , function(err,result){
        if(err){
            throw err;
        }
        res.send(result);
    });
})

//API INICIO
app.get('/inicio', function(req,res){
    con.query('SELECT * FROM Publicaciones', function(err,result){
        if(err){
            throw err;
        }
        res.send(result);
    });
})