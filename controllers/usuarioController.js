import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailRecuperarClave } from "../helpers/email.js";

const registrar = async (req, res) => {
  // Evitar registros duplicados
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({
    email,
  });

  if (existeUsuario) {
    const error = new Error("Usuario ya existe");
    return res.status(500).json({
      msg: error.message,
    });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();

    emailRegistro(usuarioAlmacenado)
    return res.status(200).json({
      msg: "Usuario creado correctamente, revisa tu email para confirmar tu cuenta"
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({
    email,
  });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({
      msg: error.message,
    });
  }
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(404).json({
      msg: error.message,
    });
  }

  if (await usuario.comprobarPassword(password)) {
    const userObj = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };
    return res.status(200).json(
      { 
        ...userObj,
        token: generarJWT(userObj)}
      );
  } else {
    const error = new Error("Password incorrecta");
    return res.status(404).json({
      msg: error.message,
    });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({
    token,
  });

  if (usuario) {
    usuario.confirmado = true;
    usuario.token = '';
    usuario.save();

    return res.status(200).json({ msg: "Confirmado OK"});
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({
      msg: error.message,
    });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const usuario = await Usuario.findOne({
    email,
  });

  if (usuario) {
    usuario.token = generarId();
    usuario.save();

    emailRecuperarClave(usuario)

    return res.status(200).json({msg: "Hemos enviado un email con las instrucciones"});
  } else {
    const error = new Error("Usuario no existe");
    return res.status(404).json({
      msg: error.message,
    });
  }
};

const validarToken = async (req, res) => {
    const { token } = req.params;
  
    const usuario = await Usuario.findOne({
      token,
    });
  
    if (usuario) {
      return res.status(200).json("Token valido");
    } else {
      const error = new Error("Token no valido");
      return res.status(404).json({
        msg: error.message,
      });
    }
  };

  const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body
  
    const usuario = await Usuario.findOne({
      token,
    });
  
    if (usuario) {
        usuario.password = password
        usuario.token = null
      return res.status(200).json({ msg: "Clave Actualizada"});
    } else {
      const error = new Error("Token no valido");
      return res.status(404).json({
        msg: error.message,
      });
    }
  };

  const perfil = async (req, res) => {
    const { usuario } = req;

    if (usuario) {
      return res.status(200).json(usuario);
    } else {
      const error = new Error("Token no valido");
      return res.status(401).json({
        msg: error.message,
      });
    }
  };

  const buscarUsuario = async (req, res) => {
    const user = req.usuario;
    const {email} = req.params

    try {
      const usuario = await Usuario.findOne({
        email
      }).select("-confirmado -password -createdAt -__v -token")
  
      if (!usuario) {
        return res.status(404).json({ msg: "Usuario no existe" });
      }
  
      return res.status(200).json(
       usuario
      );
    } catch (error) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
  };



export { registrar, autenticar, confirmar, olvidePassword, validarToken, nuevoPassword, perfil, buscarUsuario };
