import mongoose from "mongoose"

const conectarDB = async() => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            retryWrites: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        mongoose.connection.syncIndexes()

        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log("Conectado en url: ",url)
    }catch(error){
        console.log(`Error: ${error.message}`)
        process.exit(1);
    }
}

export default conectarDB