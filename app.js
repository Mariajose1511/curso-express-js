// Carga variables de entorno y dependencias principales
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

// Utilidades de sistema de archivos (para ejemplos posteriores)
const fs = require('fs');
const path = require('path');
// Ruta del archivo JSON de usuarios para operaciones de ejemplo
const usersFilePath = path.join(__dirname, 'users.json'); //Leo el archivo users.json

// Inicialización de la aplicación Express

const app = express();

// Middlewares para parsear cuerpos JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta básica de bienvenida (página principal)
// Muestra HTML sencillo para verificar que el servidor responde
app.get('/', (req, res) => {
  res.send(`
    <h1>¡Curso Express.js!</h1>
    <p>Esta es mi primera aplicación con Express.js_V2</p>
    <p>corre en el puerto: ${PORT}</p>
  `);
});

// Ruta con parámetro de ruta dinámico
// Ejemplo: GET /users/10 devuelve el ID solicitado
app.get('/users/:id', (req,res) => {
  const userId = req.params.id;
  res.send(`Usuario con ID: ${userId}`);
});

// Ruta con parámetros de consulta opcionales (query params)
// Ejemplo: GET /search?termino=libro&categoria=novela
app.get('/search',(req,res) => {
  const terms = req.query.termino || 'No se proporcionó término de búsqueda';
  const category = req.query.categoria || 'No se proporcionó categoría';
  res.send(`
    <h2>Resultados de búsqueda</h2>
    <p>Término: ${terms}</p>
    <p>Categoría: ${category}</p>
  `);
  });

  // Ejemplo de recepción de formulario (body x-www-form-urlencoded o JSON)
  // Retorna el payload recibido para verificar el body parsing
  app.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anónimo';
    const email = req.body.email || 'No proporcionado';

    res.json({
      message: 'Formulario recibido con éxito...',
      data: {
        nombre: name,
        email: email
      }
    })
  });

  // Endpoint de API que valida presencia de datos
  // Responde 400 si el body está vacío; 201 si contiene información
  app.post('/api/data', (req, res) => {
    const data = req.body;

    if(!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos' });
    }

    res.status(201).json({
      message: 'Datos recibidos con éxito',
      data
    });
  });


  // Listado de usuarios desde el archivo JSON
  // Lee users.json y devuelve el arreglo completo; 500 si falla el disco
  app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error con la conexión de datos' });
      }
      const users = JSON.parse(data);
      res.json(users);
    });
  })

  // Alta de usuario con validaciones básicas
  // Valida campos mínimos, carga desde disco, asigna ID incremental y persiste
  app.post('/users', (req, res) => {
    const newUser = req.body;
    // validar que el usuario tenga nombre y email
    if(!newUser.name || !newUser.email) {
      return res.status(400).json({ error: 'El nombre y el email son obligatorios' });
    }
    //validar que el nombre tenga al menos 3 caracteres
    if(newUser.name.length < 3) {
      return res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres' });
    }

    //validar que el email tenga formato correcto (básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(newUser.email)) {
      return res.status(400).json({ error: 'El email no tiene un formato válido' });
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error con la conexión de datos' });
      }
      const users = JSON.parse(data);
      // Asignar un ID único al nuevo usuario
      newUser.id = users.length + 1;
      users.push(newUser);

      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al guardar el usuario' });
        }
        res.status(201).json({
          message: 'Usuario creado con éxito',
          user: newUser
        });
      });
    });  
  })

  // Actualización de usuario existente (PUT)
  // Recibe ID por parámetro de ruta y datos a actualizar en el body
  // Actualiza el usuario mediante merge de propiedades y persiste cambios
  app.put('/users/:id', (req, res) => {
    // Parsear el ID del usuario desde los parámetros de ruta
    const userId = parseInt(req.params.id);
    // Datos de actualización desde el cuerpo de la petición
    const updateDate = req.body;

    // Leer el archivo de usuarios desde disco
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error con la conexión de datos' });   
      }
      // Parsear el contenido JSON a un arreglo de usuarios
      let users = JSON.parse(data);
      // Buscar y actualizar el usuario con el ID especificado (merge de propiedades)
      users = users.map(user => user.id === userId? { ...user, ...updateDate } : user);

      // Persistir los cambios de vuelta al archivo JSON
      fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
        // Responder con confirmación y el usuario actualizado
        res.json({
          message: 'Usuario actualizado con éxito',
          user: users.find(user => user.id === userId)
        });
      });
    })
  })



// Inicio del servidor HTTP
app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en http://localhost:${PORT}`);
});