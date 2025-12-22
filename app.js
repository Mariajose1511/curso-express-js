require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <h1>¡Curso Express.js!</h1>
    <p>Esta es mi primera aplicación con Express.js_V2</p>
    <p>corre en el puerto: ${PORT}</p>
  `);
});

app.get('/users/:id', (req,res) => {
  const userId = req.params.id;
  res.send(`Usuario con ID: ${userId}`);
});

app.get('/search',(req,res) => {
  const terms = req.query.termino || 'No se proporcionó término de búsqueda';
  const category = req.query.categoria || 'No se proporcionó categoría';
  res.send(`
    <h2>Resultados de búsqueda</h2>
    <p>Término: ${terms}</p>
    <p>Categoría: ${category}</p>
  `);
  });



app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en http://localhost:${PORT}`);
});