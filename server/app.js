const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const path = require('path');
const axios = require('axios');
require('dotenv').config();


const key = process.env.REACT_APP_OPENAI_API_KEY
const API_KEY = process.env.REACT_APP_DUCK_KEY;
const API_SECRET = process.env.REACT_APP_DUCK_SECRET;


// Middleware for handling CORS issues
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../build')));


app.post('/api/openai', async (req, res) => {
    try {
        const input = req.body.messages;
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-3.5-turbo",
            messages: input,
            temperature: 1.2,
            top_p: 1,
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${key}`,
            },
        }).catch(error => {
            console.error(error);
            throw error;
        });
        res.json(response.data.choices[0]);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.post('/api/uberduck', async (req, res) => {
    try {
        const input = req.body.speech;

        const options = {
            method: 'POST',
            headers: {
                accept: 'audio/wav',
                'uberduck-id': 'anond98e3de5-8b78-4706-98ae-e24058aaf97cymous',
                'content-type': 'application/json',
                authorization: 'Basic ' + Buffer.from(API_KEY + ':' + API_SECRET).toString('base64'),
            },
            data: JSON.stringify({ voicemodel_uuid: "d98e3de5-8b78-4706-98ae-e24058aaf97c", pace: 1, speech: `${input}` }),
            url: 'https://api.uberduck.ai/speak-synchronous',
            responseType: 'arraybuffer',
        };
        const response = await axios(options);
        const audioBuffer = Buffer.from(response.data, 'binary');
        const base64Audio = audioBuffer.toString('base64');
        res.json({ audio: base64Audio });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});


// Serve the React app's index.html for all other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Backend server is listening at http://localhost:${port}`);
});
