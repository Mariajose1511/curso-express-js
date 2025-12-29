// Carga variables de entorno y dependencias principales
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const app = express();

// Middlewares para parsear cuerpos JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta básica de bienvenida
app.get('/', (req, res) => {
  res.send(`
    <h1>¡Curso Express.js!</h1>
    <p>Esta es mi primera aplicación con Express.js_V2</p>
    <p>corre en el puerto: ${PORT}</p>
  `);
});

// Ruta con parámetro de ruta dinámico
app.get('/users/:id', (req,res) => {
  const userId = req.params.id;
  res.send(`Usuario con ID: ${userId}`);
});

// Ruta con parámetros de consulta opcionales
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



// Inicio del servidor HTTP
app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en http://localhost:${PORT}`);
});