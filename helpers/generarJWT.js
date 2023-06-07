import jwt from "jsonwebtoken"

const generarJWT = (usuario) => {
    return jwt.sign(usuario, process.env.JWT_SECRET,{
        expiresIn: '30d'
    })
}

export default generarJWT