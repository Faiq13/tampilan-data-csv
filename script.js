// --- KONFIGURASI API BPS ---
// GANTI DENGAN API KEY YANG ANDA DAPATKAN DARI WEBSITE BPS
const apiKey = '021b9d58faa281194642d9d6bdae6362'; 

// Konfigurasi untuk mengambil data Tingkat Pengangguran Terbuka (TPT)
const idVariabel = '43'; // ID Variabel untuk TPT
const domain = '0000';   // 0000 untuk data Nasional yang dirinci per provinsi
const tahunData = '2023'; // Mengambil data terbaru tahun 2023
const periodeData = '2';  // Kode untuk periode "Agustus"

// Membuat URL API secara dinamis
const bpsApiUrl = `https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/${domain}/var/${idVariabel}/key/${apiKey}/th/${tahunData}/turth/${periodeData}`;

// Variabel global untuk menyimpan data
let allData = [];
let headers = ['Nama Provinsi', 'Nilai TPT (%)'];

// Elemen-elemen penting dari HTML
const searchInput = document.getElementById('searchInput');
const container = document.getElementById('data-container');
const loadingIndicator = document.getElementById('loading-indicator');

/**
 * Fungsi utama untuk mengambil data dari API BPS
 */
async function fetchDataFromBPS() {
    try {
        const response = await fetch(bpsApiUrl);
        const result = await response.json();

        if (result.status !== 'OK') {
            throw new Error(result['message-response']);
        }

        // Memproses data dari format JSON BPS
        const dataBPS = result.data[0];
        allData = dataBPS.vervar.map(item => {
            const provinceData = dataBPS.datacontent[item.val];
            return {
                'Nama Provinsi': item.label,
                'Nilai TPT (%)': provinceData
            };
        });

        renderTable(allData);

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        container.innerHTML = `<p style="color: red; text-align: center;">Gagal memuat data. Pesan Error: ${error.message}. <br>Pastikan API Key Anda sudah benar.</p>`;
    }
}

/**
 * Fungsi untuk me-render tabel ke dalam HTML
 * @param {Array<Object>} data - Array berisi objek data yang akan ditampilkan
 */
function renderTable(data) {
    loadingIndicator.style.display = 'none';

    if (data.length === 0) {
        container.innerHTML = '<p>Tidak ada data yang cocok dengan pencarian Anda.</p>';
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

    // Perbaikan: Memfilter data berdasarkan properti 'Nama Provinsi'
    const filteredData = allData.filter(row => {
        // Mengambil nilai provinsi, memastikan itu adalah string, lalu mengubah ke huruf kecil
        const provinceName = String(row['Nama Provinsi'] || '').toLowerCase();
        // Mengembalikan true jika nama provinsi mengandung kata yang dicari
        return provinceName.includes(searchTerm);
    });

    renderTable(filteredData);
});

// Panggil fungsi utama saat halaman dimuat
fetchDataFromBPS();


