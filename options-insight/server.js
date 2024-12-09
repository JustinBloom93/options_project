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

//synch database schema
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synchronized');
}).catch(error => {
    console.error('Error synching database:', error);
});

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

                    console.log('Options:', option); //logging

                    console.log('volume for option:', option.volume);
                    
                    const created = await Option.create({
                        type: option.type,
                        strike: option.strike,
                        expiration: new Date(option.expiration),
                        bid: option.bid,
                        ask: option.ask,
                        volume: option.volume,
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

app.get('/get-options', async (req, res) => {
    try {
        const options = await Option.findAll();
        res.json(options);
    } catch (error) {
        console.error('Error fetching options from database:', error);
        res.status(500).send('Error fetching opptions from database');
    }
});

app.get('/view-options', async (req, res) => {
    try {
        const options = await Option.findAll();
        res.send(`<pre>${JSON.stringify(options, null, 2)}</pre`);
    } catch (error) {
        console.error('Error fetching options from database:', error);
        res.status(500).send('Error fetching options from datavase');
    }
});

app.get('/get-top-options', async (reg, res) => { // top 25 highest volume
    try {
        const options = await Option.findAll({
            order: [['volume', 'DESC']],
            limit: 25
        });
        res.json(options);
    } catch (error) {
        console.error('Error fetching options from database:', error);
        res.status(500).send('Error fetching options from database');
    }
});

app.listen(1000, () => {
    console.log('Server is running on port 1000');
});







// check too see if my data is uploading into my databse

// check too see if i can use my api url against line 4 in script.js

// react native --- xpo

