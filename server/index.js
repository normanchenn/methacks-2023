require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();
const openAI = require("openai");

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

mongoose.connect(
    process.env.MONGODB_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const citySchema = new mongoose.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true },
    region: { type: String },
    population: { type: Number },
    timezone: { type: String, required: true },
    currency: { type: String, required: true },
    language: { type: String },
    popular_attractions: [{ type: String }],
    emergency_service_number: { type: Number, required: true },
    local_customs: [{ type: String }],
    local_cuisine: [{ type: String }]
});

const City = mongoose.model('City', citySchema);

const newCity = new City({
    name: 'Paris',
    country: 'France',
    region: 'Île-de-France',
    population: 2.14e6,
    timezone: 'CET',
    currency: 'Euro',
    language: 'French',
    population_attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
    emergency_service_number: 112,
    local_customs: ['Kissing on the cheek', 'No tipping in restaurants'],
    local_cuisine: ['Croissants', 'Escargots', 'Macarons'],
});
// newCity.save()
//     .then(city => {
//         console.log(`saved ${city.name} to the database`);
//     })
//     .catch(error => {
//         console.error(`Error saving ${newCity.name} to the database: ${error}`);
//     });

app.get('/api/cities/:name', async (req, res) => {
    const { name } = req.params;
  
    try {
      const city = await City.findOne({ name });
  
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
        // return res.status(404).json();
      }
  
      return res.json(city);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
});

const cohere = require('cohere-ai');
cohere.init('8GEb0w8gJW7TnKs6FLR45yWG0KSLIJNpeuIikuVF');
app.get('/api/cohere', async (req, res) => {
    const response = await cohere.generate({
        prompt: 'paris is a good place because',
        max_tokens: 100,
    });
    console.log(response);
    res.send(response);
})

app.get('/', (req, res) => {
    res.send('Hello world, from methacks');
});

const PORT = 3210;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});