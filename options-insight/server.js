'use strict';
const request = require('request');
const express = require('express');
const path = require('path');
const { sequelize, Option } = require('./database'); 

const app = express();

const apiKey = 'HRGPPJOD3YLEJF27'; 
const symbol = 'IBM';
const url = `https://www.alphavantage.co/query?function=HISTORICAL_OPTIONS&symbol=${symbol}&apikey=${apiKey}`;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/fetch-options', async (req, res) => {
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, async (err, response, data) => {
        if (err) {
            console.error('Error:', err);
            return res.status(500).send('Error fetching data');
        } else if (response.statusCode !== 200) {
            console.error('Status:', response.statusCode);
            return res.status(response.statusCode).send('Error fetching data');
        } else {
            console.log('Server: Full API Response:', data);
            const optionsData = data.data;

            if (!optionsData || !Array.isArray(optionsData)) {
                console.log('Invalid options data format:', optionsData);
                return res.status(404).send('No valid options data found');
            }

            try {
                await sequelize.sync();
                for (const option of optionsData) {
                    const created = await Option.create({
                        type: option.type,
                        strike: option.strike,
                        expiration: new Date(option.expiration),
                        bid: option.bid,
                        ask: option.ask,
                        open_interest: option.open_interest,
                    });
                    console.log('Inserted option:', created.toJSON());
                }
                res.json(optionsData);
            } catch (insertionError) {
                console.error('Error inserting options:', insertionError);
                res.status(500).send('Error inserting options');
            }
        }
    });
});

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});







// check too see if my data is uploading into my databse

// check too see if i can use my api url against line 4 in script.js

// react native --- xpo

