'use strict';
const request = require('request');
const express = require('express');
const path = require('path');
const { sequelize, Option } = require('./database'); 

const app = express();

const apiKey = 'HRGPPJOD3YLEJF27'; 
const stockSymbols = ['SPY', 'AAPL', 'NVDA', 'MSFT', 'META'] ;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => res.status(204));

//synch database schema
sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch(error => {
    console.error('Error synching database:', error);
});

app.get('/fetch-options', async (req, res) => {
    try {
        // Clear existing records first, may not be most optimal but its helps speed it up
        await Option.destroy({ where: {} });
        console.log('Existing data cleared.');

        const fetchPromises = stockSymbols.map(symbol => {
            const url = `https://www.alphavantage.co/query?function=HISTORICAL_OPTIONS&symbol=${symbol}&apikey=${apiKey}`;
            console.log(`Fetching data for ${symbol} from ${url}`);

            return new Promise((resolve, reject) => {
                request.get({
                    url: url,
                    json: true,
                    headers: { 'User-Agent': 'request' }
                }, async (err, response, data) => {
                    if (err) return reject(`Error fetching data for ${symbol}: ${err}`);
                    if (response.statusCode !== 200) return reject(`Error fetching data for ${symbol}: status code ${response.statusCode}`);
                    
                    console.log(`API Response for ${symbol}:`, JSON.stringify(data, null, 2));
                    const optionsData = data.data;

                    if (!optionsData || !Array.isArray(optionsData)) return reject(`No valid options data found for ${symbol}`);

                    try {
                        for (const option of optionsData) {
                            const existingOption = await Option.findOne({
                                where: {
                                    symbol: symbol,
                                    volume: option.volume
                                }
                            });

                            if (!existingOption) {
                                await Option.create({
                                    symbol: symbol,
                                    type: option.type,
                                    strike: option.strike,
                                    expiration: new Date(option.expiration),
                                    bid: option.bid,
                                    ask: option.ask,
                                    volume: option.volume,
                                    open_interest: option.open_interest,
                                });
                                console.log(`Inserted option: ${symbol} ${option.type} ${option.strike} ${option.expiration}`);
                            } else {
                                console.log(`Duplicate found, not inserting: ${symbol} ${option.type} ${option.strike} ${option.expiration}`);
                            }
                        }
                        resolve();
                    } catch (insertionError) {
                        console.error(`Error inserting options for ${symbol}:`, insertionError);
                        reject(`Error inserting options for ${symbol}`);
                    }
                });
            });
        });

        await Promise.all(fetchPromises);
        console.log('All data fetched and inserted for all symbols.');
        res.send('Data fetched and inserted for all symbols.');
    } catch (error) {
        console.error('Error fetching options for one or more symbols:', error);
        res.status(500).send('Error fetching options for one or more symbols');
    }
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
            limit: 150
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
