import express from "express"
import dotenv from "dotenv"
import conectarDB from "./config/db.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"
import cors from "cors"

const app = express()
app.use(express.json())

dotenv.config()
await conectarDB()

// CORS
const whiteList = [process.env.FRONTEND_URL,"*"]

const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error('Error de cors'))
        }
    }
}

app.use(cors(corsOptions))

// Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

const PORT = process.env.PORT || 4000
const servidor = app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`)

})

import { Server } from "socket.io"

const io = new Server(servidor,{
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', (socket) => {
    console.log("Conectado a socket IO")

   socket.on("abrir-proyecto", (id) =>{
    console.log("Join to room ",id)
    socket.join(id)
   })

   socket.on("nueva-tarea", (tarea) =>{
    console.log(tarea)
    socket.to(tarea.proyecto).emit("nueva-tarea", tarea)
   })

   
})