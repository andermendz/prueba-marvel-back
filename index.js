const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// conexion mongo
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//usuarios esquema basico
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    favorites: [String],
});

const User = mongoose.model("User", UserSchema);

// Rutas basica - pendiente mejorar
app.get("/api/comics", async (req, res) => {
    try {
        const response = await axios.get(`https://gateway.marvel.com/v1/public/comics`, {
            params: {
                apikey: process.env.MARVEL_API_KEY,
            },
        });
        res.json(response.data.data.results);
    } catch (error) {
        res.status(500).json({ error: "Error fetching comics" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
