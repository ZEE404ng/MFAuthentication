import { connect } from "mongoose";
const dbConnect = async () => {
    try {
        const mongoDbConnection = await connect(process.env.CONNECTION_STRING);
        console.log(`Database connected: ${mongoDbConnection.connection.host}`);
    }
    catch (error) {
        console.log(`Database connection error: ${error}`);
};
}
export default dbConnect;
