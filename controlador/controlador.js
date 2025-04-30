const modelo = require('../modelo/modelo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'clave_secreta_para_jwt';

exports.control_detalle = async (req, res) => {
  try {
    const usuario = await modelo.findById(req.params.id, { password: 0 });
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error: error.message });
  }
};

exports.control_actualizar = async (req, res) => {
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const usuarioActualizado = await modelo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true, select: '-password' }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el usuario", error: error.message });
  }
};
exports.control_crear = async (req, res) => {
  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await modelo.findOne({ 
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    });

    if (usuarioExistente) {
      return res.status(400).json({ 
        message: "El usuario o correo electrónico ya está registrado" 
      });
    }

    const nuevoUsuario = new modelo({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });

    const usuarioGuardado = await nuevoUsuario.save();
    
    // Excluye la contraseña en la respuesta
    const usuarioResponse = {
      _id: usuarioGuardado._id,
      username: usuarioGuardado.username,
      email: usuarioGuardado.email,
      createdAt: usuarioGuardado.createdAt
    };

    res.status(201).json(usuarioResponse);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el usuario", error: error.message });
  }
};

exports.control_login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const usuario = await modelo.findOne({ username });
    if (!usuario || !(await usuario.comparePassword(password))) {
      return res.status(401).json({ message: "Usuario o contraseña inválidos" });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: usuario._id,
        username: usuario.username,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error durante el login", error: error.message });
  }
};

exports.obtener_ultimas = async (req, res) => {
  try {
    // Obtener las últimas 10 temperaturas ordenadas por fecha
    const temperaturas = await temperaturas.find()
      .sort({ fecha: -1 })
      .limit(10);
    
    // Devolver en orden cronológico (de más antigua a más reciente)
    res.status(200).json(temperaturas.reverse());
  } catch (error) {
    res.status(500).json({ message: "Error al obtener temperaturas", error: error.message });
  }
};

exports.crear_temperatura = async (req, res) => {
  try {
    const nuevaTemperatura = new Temperatura({
      temperatura: req.body.temperatura
    });

    const temperaturaGuardada = await nuevaTemperatura.save();
    res.status(201).json(temperaturaGuardada);
  } catch (error) {
    res.status(400).json({ message: "Error al registrar temperatura", error: error.message });
  }
};
