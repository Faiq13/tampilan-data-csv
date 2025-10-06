// Ganti dengan URL RAW file data.csv Anda dari GitHub
const csvUrl = 'https://raw.githubusercontent.com/Faiq13/tampilan-data-csv/refs/heads/main/data.csv';

// Variabel global untuk menyimpan semua data agar tidak perlu fetch berulang kali
let allData = [];
let headers = [];

// Elemen-elemen penting dari HTML
const searchInput = document.getElementById('searchInput');
const container = document.getElementById('csv-data-container');
const loadingIndicator = document.getElementById('loading-indicator');

/**
 * Fungsi utama untuk mengambil dan menampilkan data CSV
 */
async function fetchData() {
    try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error('Gagal mengambil data!');
        }
        const csvText = await response.text();
        
        // Memproses data CSV
        const rows = csvText.trim().split('\n');
        headers = rows.shift().split(',');
        allData = rows.map(row => {
            const values = row.split(',');
            // Mengubah array menjadi objek agar lebih mudah diakses
            let obj = {};
            headers.forEach((header, i) => {
                obj[header] = values[i];
            });
            return obj;
        });

        // Menampilkan tabel untuk pertama kali
        renderTable(allData);
        
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        container.innerHTML = `<p style="color: red; text-align: center;">Gagal memuat data. Silakan coba lagi nanti.</p>`;
    }
}

/**
 * Fungsi untuk me-render tabel ke dalam HTML
 * @param {Array<Object>} data - Array berisi objek data yang akan ditampilkan
 */
function renderTable(data) {
    // Sembunyikan loading indicator
    loadingIndicator.style.display = 'none';
    
    // Jika tidak ada data yang cocok, tampilkan pesan
    if (data.length === 0) {
        container.innerHTML = '<p>Tidak ada data yang cocok dengan pencarian Anda.</p>';
        return;
    }

    const table = document.createElement('table');
    
    // Membuat header tabel
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Membuat isi tabel
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
    
    // Membersihkan kontainer dan memasukkan tabel baru
    container.innerHTML = ''; 
    container.appendChild(table);
}

// Event listener untuk search input
searchInput.addEventListener('keyup', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredData = allData.filter(row => {
        // Cek apakah ada nilai di dalam baris yang mengandung searchTerm
        return Object.values(row).some(value => 
            value.toLowerCase().includes(searchTerm)
        );
    });
    
    renderTable(filteredData);
});

// Panggil fungsi utama saat halaman pertama kali dimuat
fetchData();
