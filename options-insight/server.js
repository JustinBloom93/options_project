'use strict'
const request = require('request');
const express = require('express');
const path = require('path');
const Option = require('./database'); 

const app = express();

const apiKey = 'HRGPPJOD3YLEJF27'; 
const symbol = 'IBM';
const url = `https://www.alphavantage.co/query?function=HISTORICAL_OPTIONS&symbol=${symbol}&apikey=${apiKey}`;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/fetch-options', (req, res) => {
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Error fetching data');
        } else if (response.statusCode !== 200) {
            console.error('Status:', response.statusCode);
            return res.status(response.statusCode).send('Error fetching data');
        } else {
            console.log('Server: Full API Response:', data);
            const optionsData = data.options;

            if (!optionsData || optionsData.length === 0) {
                console.log('No options data found');
                return res.status(404).send('No options data found');
            }

            optionsData.forEach(async option => {
                await Option.create({
                    type: option.type,
                    strike: option.strike,
                    expiration: new Date(option.expiration),
                    bid: option.bid,
                    ask: option.ask
                });
            });

            res.json(optionsData);
        }
    });
});

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});






/// runApi use /// code from alphavantage.

// fix api put api code in a listener. app post

/// side page to execute app post, puts data in database

// app post is running api.

// once successful then run

// check too see if my data is uploading into my databse

// check too see if i can use my api url against line 4 in script.js

//

