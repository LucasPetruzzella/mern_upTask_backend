import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {
  const tarea = req.body;
  const user = req.usuario;
  const proyecto = await Proyecto.findById(tarea.proyecto);

  if (!proyecto) {
    return res.status(404).json({ msg: "Proyecto no existe" });
  }

  if (proyecto.creador.toString() !== user._id.toString()) {
    return res.status(401).json({ msg: "Acción no valida" });
  }

  try {
    const tareaDB = await Tarea.create(tarea);
    proyecto.tareas.push(tareaDB._id)
    await proyecto.save()
    
    return res.status(200).json(tareaDB);
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado"});
  }
};

const obtenerTarea = async (req, res) => {
    const user = req.usuario
    const { id } = req.params
    const tareaDb = await Tarea.findById(id).populate("proyecto")

    if(!tareaDb){
        return res.status(404).json({ msg: "Tarea no existe" });
    }

    if (tareaDb.proyecto.creador.toString() !== user._id.toString()) {
        return res.status(403).json({ msg: "Acción no valida" });
      }

      return res.status(200).json(tareaDb);
};

const actualizarTarea = async (req, res) => {
    const user = req.usuario
    const { id } = req.params
    const tareaDb = await Tarea.findById(id).populate("proyecto")

    if(!tareaDb){
        return res.status(404).json({ msg: "Tarea no existe" });
    }

    if (tareaDb.proyecto.creador.toString() !== user._id.toString()) {
        return res.status(403).json({ msg: "Acción no valida" });
      }

      tareaDb.nombre = req.body.nombre || tareaDb.nombre
      tareaDb.descripcion = req.body.descripcion || tareaDb.descripcion
      tareaDb.prioridad = req.body.prioridad || tareaDb.prioridad
      tareaDb.fechaEntrega = req.body.fechaEntrega || tareaDb.fechaEntrega

      return res.status(200).json(tareaDb);
};

const eliminarTarea = async (req, res) => {
    const user = req.usuario
    const { id } = req.params
    const tareaDb = await Tarea.findById(id).populate("proyecto")

    if(!tareaDb){
        return res.status(404).json({ msg: "Tarea no existe" });
    }

    if (tareaDb.proyecto.creador.toString() !== user._id.toString()) {
        return res.status(403).json({ msg: "Acción no valida" });
      }
      try{
        const proyectoDB = await Proyecto.findById(tareaDb.proyecto._id)
        proyectoDB.tareas.pull(tareaDb._id)

        await Promise.allSettled([
          await proyectoDB.save(),
          await tareaDb.deleteOne()
        ])
       
        return res.status(200).json({msg: "Tarea Eliminada"});
      }catch(error){
        console.log(error)
        return res.status(500).json({ msg: "Error Inesperado" });
      }
};

const cambiarEstado = async (req, res) => {
  const user = req.usuario
  const { id } = req.params
  const tareaDb = await Tarea.findById(id)

  if(!tareaDb){
      return res.status(404).json({ msg: "Tarea no existe" });
  }

    try{
      tareaDb.estado = !tareaDb.estado
      tareaDb.completado = user

      await tareaDb.save()

      const newTareaDb = await Tarea.findById(id).populate("completado")
      return res.status(200).json(newTareaDb);
    }catch(error){
      return res.status(500).json({ msg: "Error Inesperado" });
    }
};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
