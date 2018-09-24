var express = require ('express'); // le paso a variable app el modulo express, lo tendré que instalar.
var cors = require ('cors'); // libreria que me configura el CORS
var app = express(); // aquí ejecuto la variable express
var bodyParser = require ('body-parser'); // módulo que nos permite trabajar con el cuerpo de las peticiones
app.use(cors()); // Quiero que la variable app use CORS
// para la codificación de la url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Conexión MongoDB en mi Pc
var _mongoBBDD = 'mongodb://localhost:32768/';
const MongoClient = require('mongodb').MongoClient;


// Tambien se puede hacer así:
//var app = require ('express')(); // le paso a variable app el modulo express, lo tendré que instalar. () esto hace que lo ejecute directamente
const puerto = 3000; // configuramos puerto, debe ser por encima de 1024 (node 3000), cada puerto debe ser diferentes en cada aplicación
const host = '127.0.0.1'; // configurar host, digamos que es la estandar





app.get('/', function(entrada, respuesta){
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    respuesta.sendFile(__dirname + '/principal.html'); // __dirname te dice la ruta del Servidor y así no debes escribirla
});


app.get('/login', function(entrada, respuesta){
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    respuesta.sendFile(__dirname + '/login.html'); // __dirname te dice la ruta del Servidor y así no debes escribirla
  
});
app.post('/login', function(entrada, respuesta){   // POST petición
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    console.log(entrada.body); // Se refiere al cuerpo de la petición de lo que nosotros le estamos enviando por POST

    MongoClient.connect(_mongoBBDD,  // url
        function (err, client) {   // callback predefinido
            var tablaMongo = client.db('local').collection('usuarios');  // este 'local' se refiere al local de la base de datos de la tabla usuarios
            tablaMongo.find({nombre : entrada.body.user}).toArray(function(error, doc){ // buscame en el campo nombre la entrada del input
                // aquí tengo la información en json que es la respuesta del 'doc' -> 'doc' es la respuesta del mongo
                console.log(doc);

                // Validar aqui dentro si es usuario y password correcto
            }) 
            client.close(); // Cierro la conexión
        } 
    
    )
    if(entrada.body.user == "david" && entrada.body.pass == "David1234"){     // body es un objeto dentro de entrada
        console.log("password correcto, te redirecciono a admin.html");
        respuesta.send("valido");      
      }else{
        console.log("usuario o password no correcto !!!");
      }
    console.log('Si es correcto debería entrar aquí y redirigir a admin.html !');
    
});
// insertaré usuario
// tablaMongo.insert({nombre : entrada.body.user}).toArray(function(error, doc)
app.post('/admin', function(entrada, respuesta){   // POST petición
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    console.log(entrada.body); // Se refiere al cuerpo de la petición de lo que nosotros le estamos enviando por POST

    MongoClient.connect(_mongoBBDD,  // url
        function (err, client) {   // callback predefinido
            var tablaMongo = client.db('local').collection('usuarios');  // este 'local' se refiere al local de la base de datos de la tabla usuarios
            tablaMongo.insert({nombre : entrada.body.nombre}).toArray(function(error, doc){ // buscame en el campo nombre la entrada del input
                // aquí tengo la información en json que es la respuesta del 'doc' -> 'doc' es la respuesta del mongo
                console.log(doc);
            }) 
            tablaMongo.insert({direccion : entrada.body.direccion}).toArray(function(error, doc){ // buscame en el campo nombre la entrada del input
                // aquí tengo la información en json que es la respuesta del 'doc' -> 'doc' es la respuesta del mongo
                console.log(doc);
            })
            tablaMongo.insert({categoria : entrada.body.categoria}).toArray(function(error, doc){ // buscame en el campo nombre la entrada del input
                // aquí tengo la información en json que es la respuesta del 'doc' -> 'doc' es la respuesta del mongo
                console.log(doc);
            })
            client.close(); // Cierro la conexión
        } 
    
    )    
});

// actualizar
// tablaMongo.update({nombre : entrada.body.user}).toArray(function(error, doc)

// eliminar
// tablaMongo.delete({nombre : entrada.body.user}).toArray(function(error, doc)

app.get('/admin', function(entrada, respuesta){
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    respuesta.sendFile(__dirname + '/admin.html'); // __dirname te dice la ruta del Servidor y así no debes escribirla
});

app.get('/principal', function(entrada, respuesta){
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    respuesta.sendFile(__dirname + '/principal.html'); // __dirname te dice la ruta del Servidor y así no debes escribirla
});

app.listen(puerto, host, ()=>{

    console.log('Servidor arrancado correctamente !');
});