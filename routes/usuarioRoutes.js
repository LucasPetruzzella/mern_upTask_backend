import express from "express";
import { registrar, autenticar, confirmar, olvidePassword, validarToken, nuevoPassword, perfil, buscarUsuario } from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js"


const router = express.Router()

router.post('/', registrar)
router.post('/login', autenticar)
router.get('/perfil', checkAuth,perfil)
router.get('/:email', buscarUsuario)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword)
router.route('/olvide-password/:token').get(validarToken).post(nuevoPassword)
router.post('/nuevo-password/:token', nuevoPassword)


export default router