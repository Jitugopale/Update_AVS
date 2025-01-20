import mongoose from "mongoose";

const connectToMongo = async () => {
  await mongoose
    .connect("mongodb+srv://mongodb:mongodb@cluster0.rlfty.mongodb.net/mongodb?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("DB Connected"))
    .catch((err) => console.error("DB Connection Error: ", err));
};

export default connectToMongo;


// import mongoose from 'mongoose';

// const connections = {}; // Cache connections to avoid reconnecting unnecessarily

// const connectToMongo = async (bankName) => {
//   console.log(`Connecting to database for: ${bankName}`);

//   const dbUri = `mongodb+srv://mongodb:mongodb@cluster0.rlfty.mongodb.net/${bankName}?retryWrites=true&w=majority&appName=Cluster0`;

//   // Return existing connection if it already exists for this bank
//   if (connections[bankName]) {
//     console.log(`Using existing connection for ${bankName}`);
//     return connections[bankName];
//   }

//   try {
//     const connection = await mongoose.createConnection(dbUri, {
//       connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
//       socketTimeoutMS: 30000,   // Increase socket timeout to 30 seconds
//       bufferCommands: false,    // Disable buffering for operations
//       serverSelectionTimeoutMS: 5000 // Timeout after 5 seconds
//     });

//     connections[bankName] = connection; // Cache the connection
//     console.log(`DB Connected to ${bankName}'s database`);
//     return connection;
//   } catch (err) {
//     console.error(`DB Connection Error for ${bankName}:`, err);
//     throw new Error(`Failed to connect to ${bankName}'s database.`);
//   }
// };

// export default connectToMongo;
