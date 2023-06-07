import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

async function checkAuth(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization;
      token = token.substring(("Bearer ").length)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
      req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")

      return next()
    } catch (error) {
        return res.status(401).json({ msg: "Hubo un error"})
    }
  }else{
    return res.status(401).json({ msg: 'Token no valido o faltante' })
  }
}

export default checkAuth;
