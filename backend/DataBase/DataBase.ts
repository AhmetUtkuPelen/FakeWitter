import mongoose from 'mongoose';


export const ConnectDatabase = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log('MongoDB Connection Is Successful !');
    } catch (error) {
        console.log(error);
    }

}