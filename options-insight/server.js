'use strict';
const request = require('request');
const express = require('express');
const path = require('path');
const { sequelize, Option } = require('./database'); 

const app = express();

const apiKey = 'HRGPPJOD3YLEJF27'; 
const symbol = 'ADBE';
const url = `https://www.alphavantage.co/query?function=HISTORICAL_OPTIONS&symbol=${symbol}&apikey=${apiKey}`;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => res.status(204));

//synch database schema
sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch(error => {
    console.error('Error synching database:', error);
});

app.get('/fetch-options', (req, res) => {
    request.get({
        url: url,
        json: true,
        headers: { 'User-Agent': 'request' }
    }, async (err, response, data) => {
        if (err) return res.status(500).send('Error fetching data');
        if (response.statusCode !== 200) return res.status(response.statusCode).send('Error fetching data');
        
        console.log('API Response:', JSON.stringify(data, null, 2));
        const optionsData = data.data;

        if (!optionsData || !Array.isArray(optionsData)) return res.status(404).send('No valid options data found');

        try {
            await Option.destroy({ where: {} }); // Delete all existing records

            }
            res.json(optionsData);
        } catch (insertionError) {
            console.error('Error inserting options:', insertionError);
            res.status(500).send('Error inserting options');
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

