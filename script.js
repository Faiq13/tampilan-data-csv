// --- KONFIGURASI API BPS ---
const apiKey = '021b9d58faa281194642d9d6bdae6362'; // PASTIKAN API KEY ANDA SUDAH BENAR
const idVariabel = '43';
const domain = '0000';
const tahunData = '2023';
const periodeData = '2';

const bpsApiUrl = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/${domain}/var/${idVariabel}/key/${apiKey}/th/${tahunData}/turth/${periodeData}`;

let allData = [];
let headers = ['Nama Provinsi', 'Nilai TPT (%)'];

const searchInput = document.getElementById('searchInput');
const container = document.getElementById('data-container');
const loadingIndicator = document.getElementById('loading-indicator');

async function fetchDataFromBPS() {
    try {
        const response = await fetch(bpsApiUrl);
        const result = await response.json();

        // DEBUG: Lihat data mentah dari API BPS
        console.log('1. Data mentah dari API BPS:', result);

        if (result.status !== 'OK') {
            throw new Error(result['message-response']);
        }
        
        const dataBPS = result.data[0];
        allData = dataBPS.vervar.map(item => {
            const provinceData = dataBPS.datacontent[item.val];
            return {
                'Nama Provinsi': item.label,
                'Nilai TPT (%)': provinceData
            };
        });

        // DEBUG: Lihat data setelah kita proses
        console.log('2. Data setelah diproses menjadi tabel:', allData);

        renderTable(allData);

    } catch (error) {
        console.error('Terjadi kesalahan fatal:', error);
        container.innerHTML = `<p style="color: red; text-align: center;">Gagal memuat data. Pesan Error: ${error.message}. <br>Pastikan API Key Anda sudah benar dan cek Console (F12) untuk detail.</p>`;
    }
}

function renderTable(data) {
    loadingIndicator.style.display = 'none';
    if (data.length === 0) {
        container.innerHTML = '<p>Tidak ada data untuk ditampilkan.</p>';
        return;
    }
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
    data.forEach(rowDataObj => {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            td.textContent = rowDataObj[header];
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.innerHTML = ''; 
    container.appendChild(table);
}

// Event listener untuk search input (SUDAH DIPERBAIKI)
searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    // DEBUG: Lihat kata yang sedang dicari
    console.log('3. Mencari kata:', searchTerm);

    const filteredData = allData.filter(row => {
        const provinceName = String(row['Nama Provinsi'] || '').toLowerCase();
        return provinceName.includes(searchTerm);
    });
    
    // DEBUG: Lihat hasil setelah data difilter
    console.log('4. Hasil data setelah difilter:', filteredData);

    renderTable(filteredData);
});

fetchDataFromBPS();
