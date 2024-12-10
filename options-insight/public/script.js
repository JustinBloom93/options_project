function fetchTopOptions() {
    console.log('Fetching top 25 options by volume...');

    fetch('/get-top-options') // fetch instead of api
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Top options data received:', data);
            console.log('Data type:', typeof data);
            console.log('Data content:', JSON.stringify(data, null, 2));

            displayTopOptions(data);
        })
        .catch(error => {
            console.error('Client Error fetching top options:', error.message);
        });
}

function displayTopOptions(options) {
    console.log('Displaying top 25 options by volume...');
    const tableBody = document.querySelector('#optionsTable tbody');
    tableBody.innerHTML = '';

    if (!Array.isArray(options)) {
        console.error('Data is not an array:', options);
        return;
    }

    options.forEach(option => {
        const row = document.createElement('tr');

        const symbolCell = document.createElement('td');
        symbolCell.textContent = option.symbol;
        row.appendChild(symbolCell);

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

        const openInterestCell = document.createElement('td');
        openInterestCell.textContent = option.open_interest; // Ensure this field is correct
        row.appendChild(openInterestCell);

        tableBody.appendChild(row);
    });

    console.log('Top 25 options displayed.');
}

// Initial fetch
fetchTopOptions();




//setInterval(fetchData, 15 * 60 * 1000);
