import UsuarioDAO from '../dao/usersDAO.js';

const usuarioService = new UsuarioDAO();

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.send({ status: "success", usuarios });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    res.send({ status: "success", usuario });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.createUsuario(req.body);
    res.send({ status: "success", usuario });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.updateUsuario(req.params.id, req.body);
    res.send({ status: "success", usuario });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    await usuarioService.deleteUsuario(req.params.id);
    res.send({ status: "success", message: "Usuario deleted" });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
};
