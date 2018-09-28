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
                console.log(doc.length);

                if(doc.length == 0){    
                    // si el tamañano es 0 no tiene elementos
                    respuesta.send('erroneo');
                    
                } else if (doc.length == 1) {
                    // Se ha encontrado usuario
               
                    if (doc[0].password == entrada.body.pass){  // normalmente se comprueba el email (atributo de la bbdd)
                        console.log("esto es un IF");
                        respuesta.send('valido'); // Le envia la respuesta 'valido' al login.htmml (línea 54)
                        
                    }else{
                        console.log("esto es un ELSE");
                        respuesta.send('erroneo');
                    }
                }
            }) 
            client.close(); // Cierro la conexión
        } 
    
    )
    
    
});



// insertar link a la BBDD
// tablaMongo.insert({nombre : entrada.body.user}).toArray(function(error, doc)
app.post('/saveLinks', function(entrada, respuesta){   // POST petición
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    console.log("Entro en saveLinks.html"); // Se refiere al cuerpo de la petición de lo que nosotros le estamos enviando por POST
    
    // 'entrada.body' ya es un Json porque lo configuramos inicialmente con       app.use(bodyParser.json());
    console.log(entrada.body);

    if (entrada.body.nombre === undefined || entrada.body.direccion == undefined || entrada.body.categoria == undefined){
        // Si falta rellenar algún campo en el formulario execpto la descripción que no es necesaria
        return;
    }else{
        // Si todo esta bién !!!
        MongoClient.connect(_mongoBBDD,  // url
            function (err, client) {   // callback predefinido
                var _collection = client.db('local').collection('mis_enlaces_guardados');  // este 'local' se refiere al local de la base de datos de la tabla usuarios
                _collection.insertOne(entrada.body, (function(errors, doc){ 
                    if (!errors){
                        // Si no hay errores
                        console.log('--------************ ->>>>> '+'Este es el DOC : ',doc); 
                        respuesta.send('valido');
                    }else{
                        // En caso de errores
                        respuesta.json('{error_envío: "Algo salió mal"}');
                    }
                })); 
                
                client.close(); // Cierro la conexión
            } 
        
        ) 
    }
               
});

// Listar 
app.get('/dame_enlaces', function(entrada, respuesta){
    MongoClient.connect(_mongoBBDD,  
        function (err, client) {   
            var tablaMongo = client.db('local').collection('mis_enlaces_guardados');  
            
            tablaMongo.find({}).toArray(function(error_desde_mongo, respuesta_desde_mongo){ 
               
                if(!error_desde_mongo){
                    // respuesta.json(respuesta_desde_mongo);
                    respuesta.send(JSON.stringify(respuesta_desde_mongo)); // forzamos el JSON
                }else{
                  console.log("error de servidor !");  
                }
                
            }) 
            client.close(); // Cierro la conexión
        } 
    
    )
    
})
app.get('/listado', function(entrada, respuesta){
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    respuesta.sendFile(__dirname + '/listado.html'); // __dirname te dice la ruta del Servidor y así no debes escribirla
});


// actualizar
// tablaMongo.update({nombre : entrada.body.user}).toArray(function(error, doc)


// eliminar
// tablaMongo.delete({nombre : entrada.body.user}).toArray(function(error, doc)

app.get('/saveLinks', function(entrada, respuesta){
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    respuesta.sendFile(__dirname + '/saveLinks.html'); // __dirname te dice la ruta del Servidor y así no debes escribirla
});

app.get('/principal', function(entrada, respuesta){
    // Aquí devuelvo una web, no es el proposito de ExpressJs el devolver páginas web
    respuesta.sendFile(__dirname + '/principal.html'); // __dirname te dice la ruta del Servidor y así no debes escribirla
});






app.listen(puerto, host, ()=>{

    console.log('Servidor arrancado correctamente !');
});