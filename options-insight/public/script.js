let optionsData = [];

// Fetch data from the server and display it
function fetchOptions() {
    console.log('Fetching top 150 options by volume...');

    fetch('/get-top-options')
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

        ['symbol', 'type', 'strike', 'expiration', 'bid', 'ask', 'volume', 'open_interest'].forEach(field => { //table
            const cell = document.createElement('td');
            cell.textContent = option[field];
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    console.log('Top 150 options displayed.');
}

function startFetching() {
    fetchOptions();
    setInterval(fetchOptions, 300000); // fetch from database every 5 minutes
}

function filterOptions(query) { // search filter
    const filteredOptions = optionsData.filter(option => {
        return option.symbol.toLowerCase().includes(query.toLowerCase()) ||
               option.type.toLowerCase().includes(query.toLowerCase());
    });
    displayTopOptions(filteredOptions);
}

document.getElementById('searchInput').addEventListener('input', event => {
    filterOptions(event.target.value);
});

// Initial fetch for top options
startFetching();