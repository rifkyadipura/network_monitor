let devices = []; // Array kosong untuk menyimpan perangkat

// Fungsi Tambah Perangkat
function addDevice() {
    const name = document.getElementById('device-name').value.trim();
    const url = document.getElementById('device-url').value.trim();

    // Validasi input
    if (!name || !url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        alert('Please enter a valid Device Name and a URL/IP with "http://" or "https://"');
        return;
    }

    // Tambahkan perangkat ke array jika belum ada
    devices.push({ name, url, status: "Checking..." });
    document.getElementById('device-name').value = '';
    document.getElementById('device-url').value = '';

    updateTable(); // Perbarui tabel
}

// Fungsi Cek Status HTTP/HTTPS
function checkHTTPStatus() {
    const tableBody = document.getElementById('monitor-table');
    const notificationArea = document.getElementById('notification-area');
    const notificationMessage = document.getElementById('notification-message');
    let downDevices = []; // Simpan perangkat yang DOWN

    // Perbarui status perangkat
    devices.forEach((device, index) => {
        fetch(device.url, { method: 'HEAD', mode: 'no-cors' })
            .then(() => {
                devices[index].status = "UP";
            })
            .catch(() => {
                devices[index].status = "DOWN";
                downDevices.push(device.name);
            })
            .finally(() => {
                renderTable(); // Render ulang tabel dengan status terbaru

                // Tampilkan notifikasi jika ada perangkat DOWN
                if (downDevices.length > 0) {
                    notificationMessage.innerHTML = `
                        <strong>Attention!</strong> The following devices are DOWN: ${downDevices.join(", ")}
                    `;
                    notificationArea.style.display = "block";
                } else {
                    notificationArea.style.display = "none";
                }
            });
    });
}

// Fungsi Render Tabel
function renderTable() {
    const tableBody = document.getElementById('monitor-table');
    tableBody.innerHTML = ''; // Kosongkan tabel untuk diisi ulang

    devices.forEach(device => {
        tableBody.innerHTML += `
            <tr>
                <td>${device.name}</td>
                <td>${device.url}</td>
                <td class="${device.status === 'UP' ? 'status-up' : 'status-down'}">${device.status}</td>
            </tr>
        `;
    });
}

// Fungsi Perbarui Tabel
function updateTable() {
    checkHTTPStatus();
}

// Jalankan Pengecekan Status Setiap 5 Detik
setInterval(updateTable, 5000);
