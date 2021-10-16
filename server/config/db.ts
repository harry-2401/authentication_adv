import { connect } from "mongoose";

const connectDb = async () => {
  try {
    await connect(process.env.MONGO_URI as string);
    console.log("Database connected");
  } catch (_e) {
    console.log((_e as Error).message);
  }
};

export default connectDb;
