const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3001;
require('dotenv').config();

// Connect to Sql Server
const { connectToSqlServer } = require("./database")
connectToSqlServer();

const router = require("./routes");

// Add routes
app.use(router);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

