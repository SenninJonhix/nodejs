const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const users = require('./rutas/logs');
const bodyParser = require('body-parser');

const uri = 'mongodb+srv://reto0:reto0@proyecto0.woexhzb.mongodb.net/reto0';

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(uri)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'vista', 'index.html'));
});

app.get('/pantalla', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gato/pantalla.html'));
});
app.use('/api/users', users);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
