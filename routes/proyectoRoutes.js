import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
} from "../controllers/proyectoController.js"

const router = express.Router()

router
    .route("/")
    .get(checkAuth, obtenerProyectos)
    .post(checkAuth,nuevoProyecto)

router
    .route("/:id")
    .get(checkAuth, obtenerProyecto)
    .put(checkAuth,editarProyecto)
    .delete(checkAuth,eliminarProyecto)

router.post('/colaboradores/:id', checkAuth, agregarColaborador)
router.get('/colaboradores/:id', checkAuth, buscarColaborador)
router.put('/colaboradores/:id', checkAuth, eliminarColaborador)



export default router