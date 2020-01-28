const mongo = require('mongoose');
//Uniquevalidator
var uniqueValidator = require('mongoose-unique-validator');

const Schema = mongo.Schema;

var rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol permitido'
};

const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: {
      type: String,
      unique: true,
      required: [true, 'El correo es necesario']
    },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    img: { type: String, required: false },
    role: {
      type: String,
      required: true,
      default: 'USER_ROLE',
      enum: rolesValidos
    }
  },
  { versionKey: false }
);

usuarioSchema.plugin(uniqueValidator, {
  message: 'El {PATH} debe de ser unico'
});
module.exports = mongo.model('Usuario', usuarioSchema);
