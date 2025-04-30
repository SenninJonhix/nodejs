const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/]
  }
}, { timestamps: true });


const temperaturaSchema = new mongoose.Schema({
  timestamps: {
    type: Date,
    default: Date.now
  },
  temperatura: {
    type: Number,
    required: true
  }
});

const Temperatura = mongoose.model('temperaturas', temperaturaSchema);
module.exports = Temperatura;

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hash si la contraseña ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();
  
  try {
    // Generar un salt
    const salt = await bcrypt.genSalt(10);
    // Hash la contraseña con el salt generado
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;