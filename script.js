// (Kode ini sama persis seperti sebelumnya)

const csvData = `Nama,Harga,Stok
Buku Tulis,5000,120
Pensil 2B,2500,300`;

function displayCsvAsTable(csvString) {
    const rows = csvString.trim().split('\n');
    const headers = rows.shift().split(',');
    const container = document.getElementById('csv-data-container');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    rows.forEach(rowData => {
        const tr = document.createElement('tr');
        const cells = rowData.split(',');
        cells.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = '';
    container.appendChild(table);
}

displayCsvAsTable(csvData);
