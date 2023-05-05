require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello world, from methacks');
});

const PORT = 3210;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});