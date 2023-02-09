const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
dotenv.config();

const authRoute = require("./routes/auth");
const userRoute = require('./routes/users');

// Connect with MongoDb Database
mongoose.set('strictQuery', true);
// mongoose
//     .connect(process.env.MONGO_DB_URL)
//     .then(() => console.log('DB Connection Successfull!'))
//     .catch((err) => {
//         console.log(err);
//     })

mongoose.connect(process.env.MONGO_DB_URL, () => {
    console.log("connected to mongo");
});
  

// All Routes
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

// Create server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});