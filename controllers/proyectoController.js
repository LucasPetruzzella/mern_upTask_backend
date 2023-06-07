import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";
import Usuario from "../models/Usuario.js";

const obtenerProyectos = async (req, res) => {
  const user = req.usuario;

  const proyectos = await Proyecto.find({
    '$or' : [
      { 'colaboradores': { $in: user}},
      { 'creador': { $in: user}},
    ]
  }).select("-tareas");

  return res.status(200).json(proyectos);
};

const nuevoProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario._id;

  try {
    const proyectoDB = await proyecto.save();
    return res.status(200).json(proyectoDB);
  } catch (error) {
    return res.status(500).json({ msg: "Error inesperado" });
  }
};

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;

  try {
    const proyecto = await Proyecto.findById(id).populate({
      path: 'tareas',
      populate: { 
          path: "completado", select: "nombre" }
    }).populate("colaboradores","nombre email");
    
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no existe" });
    }

    if ((proyecto.creador.toString() !== user._id.toString()) && !proyecto.colaboradores.some(c => c._id.toString() === user._id.toString())) {
    
    
      return res.status(401).json({ msg: "Acción no valida" });
    }

    return res.status(200).json(
      proyecto
    );
  } catch (error) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;
  const { nombre, descripcion, fechaEntrega, cliente } = req.body;

  try {
    let proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no existe" });
    }

    if (proyecto.creador.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "Acción no valida" });
    }

    proyecto.nombre = nombre || proyecto.nombre;
    proyecto.descripcion = descripcion || proyecto.descripcion;
    proyecto.fechaEntrega = fechaEntrega || proyecto.fechaEntrega;
    proyecto.cliente = cliente || proyecto.cliente;

    proyecto.save();

    return res.status(200).json(proyecto);
  } catch (error) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;

  try {
    let proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no existe" });
    }

    if (proyecto.creador.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "Acción no valida" });
    }

    await proyecto.deleteOne();

    return res.status(200).json({ msg: "Proyecto Eliminado" });
  } catch (error) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

const buscarColaborador = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;

  try {
    const usuario = Usuario.findOne({
      email
    })

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no existe" });
    }

    return res.status(200).json(
      proyecto.colaboradores
    );
  } catch (error) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

const agregarColaborador = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;
  const { id: userId } = req.body

  try {
    let proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no existe" });
    }

    if (proyecto.creador.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "Acción no valida" });
    }

    const usuario = await Usuario.findById(userId)

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no existe" });
    }

    if (proyecto.creador.toString() === usuario._id.toString()) {
      return res.status(404).json({ msg: "El creador no puede ser colaborador" });
    }

    if (proyecto.colaboradores.includes(usuario._id)) {
      return res.status(404).json({ msg: "El usuario ya existe en el proyecto" });
    }


    proyecto.colaboradores.push(usuario)
    await proyecto.save()

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }


  
};

const eliminarColaborador = async (req, res) => {
  const { id } = req.params;
  const user = req.usuario;
  const { id: userId } = req.body

  try {
    let proyecto = await Proyecto.findById(id);

    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no existe" });
    }

    if (proyecto.creador.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "Acción no valida" });
    }

    const usuario = await Usuario.findById(userId)

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no existe" });
    }

    proyecto.colaboradores = proyecto.colaboradores.filter(c => c._id != userId)

    await proyecto.save()

    return res.status(200).json({msg: "Colaborador eliminado correctamente"});
  } catch (error) {
    return res.status(404).json({ msg: "Proyecto no encontrado" });
  }
};

export {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  buscarColaborador
};
