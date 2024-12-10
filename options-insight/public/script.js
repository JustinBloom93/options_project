let optionsData = [];

function fetchTopOptions(symbol = 'ADBE') {
    console.log(`Fetching top 25 options for ${symbol} by volume...`);

    fetch(`/get-top-options?symbol=${symbol}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('Top options data received:', data);
            optionsData = data;
            displayTopOptions(data);
        })
        .catch(error => {
            console.error('Client Error fetching top options:', error.message);
        });
}

function displayTopOptions(options) {
    const tableBody = document.getElementById('optionsTableBody');
    tableBody.innerHTML = '';

    options.forEach(option => {
        const row = document.createElement('tr');

        ['symbol', 'type', 'strike', 'expiration', 'bid', 'ask', 'volume', 'open_interest'].forEach(field => {
            const cell = document.createElement('td');
            cell.textContent = option[field];
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    console.log('Top 25 options displayed.');
}

function filterOptions(query) {
    const filteredOptions = optionsData.filter(option => {
        return option.symbol.toLowerCase().includes(query.toLowerCase()) ||
               option.type.toLowerCase().includes(query.toLowerCase());
    });
    displayTopOptions(filteredOptions);
}

document.getElementById('searchInput').addEventListener('input', event => {
    filterOptions(event.target.value);
});

fetchTopOptions();





//setInterval(fetchData, 15 * 60 * 1000);
