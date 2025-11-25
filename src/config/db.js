import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Conectado con MongoDB! xD");
  } catch (error) {
    console.log("Error al conectarse con MongoDB");
  }
};

export default connectMongoDB;
