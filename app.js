require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>¡Curso Express.js!</h1>
    <p>Esta es mi primera aplicación con Express.js_V2</p>
    <p>corre en el puerto: ${PORT}</p>
  `);
});

app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en http://localhost:${PORT}`);
});