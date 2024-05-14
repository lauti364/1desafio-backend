const express = require('express');
const userModel = require('../models/user.model.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let users = await userModel.find();
        res.send({ result: "success", payload: users });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor" });
    }
});

router.post('/', async (req, res) => {
    let { nombre, apellido, email } = req.body;
    if (!nombre || !apellido || !email) {
        res.status(400).send({ status: "error", error: "Faltan parámetros" });
        return;
    }
    try {
        let result = await userModel.create({ nombre, apellido, email });
        res.status(201).send({ result: "success", payload: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor" });
    }
});

router.put('/:uid', async (req, res) => {
    let { uid } = req.params;
    let userToReplace = req.body;

    if (!userToReplace.nombre || !userToReplace.apellido || !userToReplace.email) {
        res.status(400).send({ status: "error", error: "Parámetros no definidos" });
        return;
    }
    try {
        let result = await userModel.updateOne({ _id: uid }, userToReplace);
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor" });
    }
});

router.delete('/:uid', async (req, res) => {
    let { uid } = req.params;
    try {
        let result = await userModel.deleteOne({ _id: uid });
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor" });
    }
});

module.exports = router;
