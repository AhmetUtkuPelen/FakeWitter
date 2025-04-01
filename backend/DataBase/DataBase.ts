import mongoose from 'mongoose';


export const ConnectDatabase = async () => {

    try {

        if(!process.env.MONGO_URL){
            throw new Error("MONGO_URL is not defined");
        }

        const mongoUrl = process.env.MONGO_URL;

        await mongoose.connect(mongoUrl);
        console.log('MongoDB Connection Is Successful !');
    } catch (error) {
        console.log(error);
    }

}