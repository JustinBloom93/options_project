const apiKey = 'HRGPPJOD3YLEJF27'; 
const symbol = 'IBM';

function fetchData() {
    console.log('Fetching data...');

    fetch(`https://www.alphavantage.co/query?function=HISTORICAL_OPTIONS&symbol=${symbol}&apikey=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            console.log('Data type:', typeof data);
            console.log('Data content:', JSON.stringify(data, null, 2));

            if (!data || !data.data || !Array.isArray(data.data)) {
                console.error('Invalid data format:', data);
                return;
            }

            displayData(data.data);
        })
        .catch(error => {
            console.error('Client Error fetching data:', error.message);
        });
}

function displayData(data) {
    console.log('Displaying data...');
    const tableBody = document.querySelector('#optionsTable tbody');
    tableBody.innerHTML = '';

    if (!Array.isArray(data)) {
        console.error('Data is not an array:', data);
        return;
    }

    data.forEach(option => {
        const row = document.createElement('tr');

        const optionTypeCell = document.createElement('td');
        optionTypeCell.textContent = option.type;
        row.appendChild(optionTypeCell);

        const strikePriceCell = document.createElement('td');
        strikePriceCell.textContent = option.strike;
        row.appendChild(strikePriceCell);

        const expirationDateCell = document.createElement('td');
        expirationDateCell.textContent = option.expiration;
        row.appendChild(expirationDateCell);

        const bidCell = document.createElement('td');
        bidCell.textContent = option.bid;
        row.appendChild(bidCell);

        const askCell = document.createElement('td');
        askCell.textContent = option.ask;
        row.appendChild(askCell);

        const volumeCell = document.createElement('td');
        volumeCell.textContent = option.volume; 
        row.appendChild(volumeCell);

        const open_interestCell = document.createElement('td');
        open_interestCell.textContent = option.open_interest; 
        row.appendChild(open_interestCell);

        tableBody.appendChild(row);
    });

    console.log('Data displayed.');
}

fetchData();




//setInterval(fetchData, 15 * 60 * 1000);
