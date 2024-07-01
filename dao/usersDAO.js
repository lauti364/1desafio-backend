import Usuario from './models/usuarios.model';

class UsuarioDAO {
  async getAllUsuarios() {
    return await Usuario.find();
  }

  async getUsuarioById(id) {
    return await Usuario.findById(id);
  }

  async createUsuario(usuarioData) {
    const usuario = new Usuario(usuarioData);
    return await usuario.save();
  }

  async updateUsuario(id, usuarioData) {
    return await Usuario.findByIdAndUpdate(id, usuarioData, { new: true });
  }

  async deleteUsuario(id) {
    return await Usuario.findByIdAndDelete(id);
  }
}

export default UsuarioDAO;
