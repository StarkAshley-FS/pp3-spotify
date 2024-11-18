const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const spotifyRoutes = require('./routes/spotifyRoutes');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes, spotifyRoutes);

app.get('/', (req, res) => res.send('Spotify Music Search App'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
