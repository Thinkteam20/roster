const mongoose = require("mongoose");

const uri =
  "mongodb+srv://iffice:LEcKt14E63Y4yiZ4@cluster0.aq1o4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(uri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected!");
//   } catch (err) {
//     console.log(err);
//     process.exit(1);
//   }
// };

async function connectDB() {
  return await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectDB;
